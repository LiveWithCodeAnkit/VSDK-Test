import {
  AlertCircleIcon,
  ChevronRightIcon,
  LogOutIcon,
  MicIcon,
  MonitorIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  VideoIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";

interface Participant {
  participantId: string;
  name: string;
  timelog: { start: string; end: string }[];
  events: {
    webcam: { start: string; end: string }[];
    mic: { start: string; end: string }[];
    errors?: { start: string; message: string }[];
  };
}

interface NewParticipantsData {
  start: string;
  end: string;
  participantArray: Participant[];
}
// Helper functions
const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/(\S+) (\d{2}) (\d{4}), (\d{2}:\d{2})/, "$1 $2 $3, $4");
};

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const calculateDuration = (startIso: string, endIso: string): string => {
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  return minutes > 0 ? `${minutes} Mins` : "0 Mins";
};

// Timeline calculation helpers
const TIMELINE_WIDTH = 1200;

const calculateTimelinePosition = (eventTime: string, sessionStart: string, sessionEnd: string): number => {
  const sessionStartTime = new Date(sessionStart).getTime();
  const sessionEndTime = new Date(sessionEnd).getTime();
  const eventTimestamp = new Date(eventTime).getTime();

  const sessionDuration = sessionEndTime - sessionStartTime;
  const eventOffset = eventTimestamp - sessionStartTime;

  return Math.max(0, (eventOffset / sessionDuration) * TIMELINE_WIDTH);
};

const calculateEventWidth = (startTime: string, endTime: string, sessionStart: string, sessionEnd: string): number => {
  const sessionStartTime = new Date(sessionStart).getTime();
  const sessionEndTime = new Date(sessionEnd).getTime();
  const eventStartTime = new Date(startTime).getTime();
  const eventEndTime = new Date(endTime).getTime();

  const sessionDuration = sessionEndTime - sessionStartTime;
  const eventDuration = eventEndTime - eventStartTime;

  return Math.max(4, (eventDuration / sessionDuration) * TIMELINE_WIDTH);
};

const getDeviceIcon = (participant: any) => {
  return participant.events.webcam.length > 0 ? MonitorIcon : SmartphoneIcon;
};

const hasReconnections = (timelog: any[]) => {
  return timelog.length > 1;
};

// Tooltip Component
const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  show: boolean;
}> = ({ children, content, show }) => (
  <div className="relative">
    {children}
    {show && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50 shadow-lg">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
      </div>
    )}
  </div>
);

export const ParticipantTimelineSection = ({ newParticipantsData,
}: { newParticipantsData: any }): JSX.Element => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const sessionStart = newParticipantsData.start;
  const sessionEnd = newParticipantsData.end;

  return (
    <section className="w-full py-4">
      {newParticipantsData.participantArray.map((participant: any, index: number) => {
        const firstTimelog = participant.timelog[0];
        const lastTimelog = participant.timelog[participant.timelog.length - 1];
        const date = firstTimelog ? formatDateTime(firstTimelog.start) : "N/A";
        const duration = firstTimelog && lastTimelog ? calculateDuration(firstTimelog.start, lastTimelog.end) : "N/A";

        // Calculate positions for timeline elements
        const joinPosition = firstTimelog ? calculateTimelinePosition(firstTimelog.start, sessionStart, sessionEnd) : 0;
        const leavePosition = lastTimelog ? calculateTimelinePosition(lastTimelog.end, sessionStart, sessionEnd) : TIMELINE_WIDTH;

        const DeviceIcon = getDeviceIcon(participant);
        const reconnectionCount = participant.timelog.length;
        const hasReconnection = hasReconnections(participant.timelog);

        return (
          <React.Fragment key={participant.participantId}>
            <div className="w-full px-6 py-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-[5px] py-2.5 bg-[#181818]">
                  <h3 className="font-semibold text-white text-base font-['Lato',Helvetica]">
                    {participant.name} ({participant.participantId})
                  </h3>
                  <p className="opacity-75 font-medium text-white text-xs font-['Lato',Helvetica]">
                    {date}&nbsp;&nbsp;|&nbsp;&nbsp;Duration {duration}
                  </p>
                </div>

                <Button
                  variant="link"
                  className="p-0 h-auto flex items-center gap-0.5"
                >
                  <span className="font-semibold text-[#5568fe] text-sm text-right font-['Lato',Helvetica]">
                    View details
                  </span>
                  <ChevronRightIcon className="w-[19px] h-[19px]" />
                </Button>
              </div>

              {/* Dynamic Timeline visualization */}
              <div className="w-full h-[27px] mt-4 relative">
                {/* Join event */}
                <Tooltip
                  content={`Joined: ${firstTimelog ? formatTime(firstTimelog.start) : 'N/A'}`}
                  show={hoveredElement === `join-${participant.participantId}`}
                >
                  <div
                    className="inline-flex items-start gap-2.5 p-1.5 absolute top-px bg-[#777777] rounded-[10px] border border-solid cursor-pointer"
                    style={{ left: `${joinPosition}px` }}
                    onMouseEnter={() => setHoveredElement(`join-${participant.participantId}`)}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <DeviceIcon className="w-3 h-3" />
                  </div>
                </Tooltip>

                {/* Main session line */}
                {firstTimelog && lastTimelog && (
                  <div
                    className="absolute h-1 top-[11px] bg-[#5568fe]"
                    style={{
                      left: `${joinPosition + 24}px`,
                      width: `${Math.max(0, leavePosition - joinPosition - 48)}px`
                    }}
                  />
                )}

                {/* Webcam events */}
                {participant.events.webcam.map((webcam: any, webcamIndex: number) => {
                  const startPos = calculateTimelinePosition(webcam.start, sessionStart, sessionEnd);
                  const width = calculateEventWidth(webcam.start, webcam.end, sessionStart, sessionEnd);

                  return (
                    <div key={`webcam-${webcamIndex}`}>
                      <Tooltip
                        content={`Video: ${formatTime(webcam.start)} - ${formatTime(webcam.end)}`}
                        show={hoveredElement === `webcam-${participant.participantId}-${webcamIndex}`}
                      >
                        <div
                          className="flex w-[22px] h-[22px] items-center justify-center gap-2.5 p-1 absolute top-0.5 bg-[#5568fe] rounded-[9px] cursor-pointer"
                          style={{ left: `${startPos}px` }}
                          onMouseEnter={() => setHoveredElement(`webcam-${participant.participantId}-${webcamIndex}`)}
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          <VideoIcon className="w-3 h-3" />
                        </div>
                      </Tooltip>
                      <div
                        className="absolute h-1 top-[11px] bg-[#5568fe]"
                        style={{
                          left: `${startPos + 22}px`,
                          width: `${Math.max(0, width - 22)}px`
                        }}
                      />
                    </div>
                  );
                })}

                {/* Mic events */}
                {participant.events.mic.map((mic: any, micIndex: number) => {
                  const startPos = calculateTimelinePosition(mic.start, sessionStart, sessionEnd);
                  const width = calculateEventWidth(mic.start, mic.end, sessionStart, sessionEnd);

                  return (
                    <div key={`mic-${micIndex}`}>
                      <Tooltip
                        content={`Microphone: ${formatTime(mic.start)} - ${formatTime(mic.end)}`}
                        show={hoveredElement === `mic-${participant.participantId}-${micIndex}`}
                      >
                        <div
                          className="flex w-[22px] h-[22px] items-center justify-center gap-2.5 p-1 absolute top-0.5 bg-[#5568fe] rounded-[9px] cursor-pointer"
                          style={{ left: `${startPos}px` }}
                          onMouseEnter={() => setHoveredElement(`mic-${participant.participantId}-${micIndex}`)}
                          onMouseLeave={() => setHoveredElement(null)}
                        >
                          <MicIcon className="w-3 h-3" />
                        </div>
                      </Tooltip>
                      <div
                        className="absolute h-1 top-[11px] bg-[#5568fe]"
                        style={{
                          left: `${startPos + 22}px`,
                          width: `${Math.max(0, width - 22)}px`
                        }}
                      />
                    </div>
                  );
                })}

                {/* Error events */}
                {participant.events.errors?.map((error: any, errorIndex: number) => {
                  const position = calculateTimelinePosition(error.start, sessionStart, sessionEnd);

                  return (
                    <Tooltip
                      key={`error-${errorIndex}`}
                      content={`Error at ${formatTime(error.start)}: ${error.message}`}
                      show={hoveredElement === `error-${participant.participantId}-${errorIndex}`}
                    >
                      <div
                        className="inline-flex items-start gap-2.5 p-[3px] absolute top-1 bg-[#f17676] rounded-[5px] cursor-pointer"
                        style={{ left: `${position}px` }}
                        onMouseEnter={() => setHoveredElement(`error-${participant.participantId}-${errorIndex}`)}
                        onMouseLeave={() => setHoveredElement(null)}
                      >
                        <AlertCircleIcon className="w-2 h-2" />
                      </div>
                    </Tooltip>
                  );
                })}

                {/* Reconnection indicator */}
                {hasReconnection && (
                  <Tooltip
                    content={`Reconnected ${reconnectionCount} times`}
                    show={hoveredElement === `reconnect-${participant.participantId}`}
                  >
                    <div
                      className="absolute w-[22px] h-[27px] top-0 cursor-pointer"
                      style={{ left: `${joinPosition + 45}px` }}
                      onMouseEnter={() => setHoveredElement(`reconnect-${participant.participantId}`)}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <div className="h-[27px]">
                        <div className="relative w-[22px] h-[27px]">
                          <div className="flex w-[18px] h-[17px] items-start gap-2.5 p-1 absolute top-2.5 left-0.5 bg-[#d0d0d0] rounded-[7px]">
                            <img
                              className="w-2.5 h-2.5 mb-[-1.00px]"
                              alt="Element layers"
                              src="/2-layers.svg"
                            />
                          </div>
                          <div className="flex w-5 h-5 items-start gap-2.5 pt-1 pb-2 px-1 absolute top-[5px] left-px bg-white rounded-[7px] shadow-[0px_4px_4px_#00000040]">
                            <img
                              className="w-2.5 h-2.5 mb-[-2.00px]"
                              alt="Element layers"
                              src="/2-layers.svg"
                            />
                          </div>
                          <div className="flex w-[22px] h-[22px] items-center justify-center gap-2.5 p-1 absolute top-0 left-0 bg-[#5568fe] rounded-[7px]">
                            <span className="font-bold text-white text-sm font-['Lato',Helvetica] mt-[-2.50px] mb-[-0.50px]">
                              {reconnectionCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                )}

                {/* Leave event */}
                <Tooltip
                  content={`Left: ${lastTimelog ? formatTime(lastTimelog.end) : 'N/A'}`}
                  show={hoveredElement === `leave-${participant.participantId}`}
                >
                  <div
                    className="inline-flex items-start gap-2.5 p-1.5 absolute top-px bg-[#777777] rounded-[10px] border border-solid cursor-pointer"
                    style={{ left: `${leavePosition - 24}px` }}
                    onMouseEnter={() => setHoveredElement(`leave-${participant.participantId}`)}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <LogOutIcon className="w-3 h-3" />
                  </div>
                </Tooltip>
              </div>
            </div>

            {index < newParticipantsData.participantArray.length - 1 && (
              <Separator className="w-full h-px my-2" />
            )}
          </React.Fragment>
        );
      })}
    </section>
  );
};