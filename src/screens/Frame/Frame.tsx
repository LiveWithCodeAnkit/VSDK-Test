import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { ParticipantTimelineSection } from "./sections/ParticipantTimelineSection";
import { SessionHealthOverviewSection } from "./sections/SessionHealthOverviewSection";
import { meetingData } from "../../lib/constants/meetingData";

export const Frame = (): JSX.Element => {
  const [showTimeline, setShowTimeline] = useState(true);
  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="w-full max-w-[1319px]">
        <Card className="w-full border border-solid border-[#393939] bg-[#181818] rounded-none">
          <div className="relative w-full">
            {/* Session Health Overview Section */}
            <SessionHealthOverviewSection
              toggleTimeline={() => setShowTimeline((prev) => !prev)}
              showTimeline={showTimeline}
            />

            {/* Navigation Bar Section */}
            <NavigationBarSection startTime={meetingData.start} endTime={meetingData.end} />

            {/* Horizontal divider */}
            <img
              className="w-full h-px object-cover"
              alt="Divider"
              src="/div.svg"
            />

            {/* Background grid lines */}
            {/* <div className="relative">
              <img
                className="w-full max-w-[1232px] h-[353px] mx-auto px-10"
                alt="Vertical lines"
                src="/vertical-lines.png"
              />

              {/* Participant Timeline Section */}
            {/* <ParticipantTimelineSection /> */}
            {/* </div> */}
            <div
              className="relative w-full mx-auto"
              style={{
                backgroundImage: "url('/vertical-lines.png')",
                backgroundSize: 'cover', // Ensures the image covers the entire div
                backgroundPosition: 'center', // Centers the image
                backgroundRepeat: 'no-repeat' // Prevents the image from repeating
              }}
            >
              {/* Participant Timeline Section */}
              {showTimeline ? (
                meetingData ? (
                  <ParticipantTimelineSection newParticipantsData={meetingData} />
                ) : (
                  <div className="text-white text-center py-4">No data available</div>
                )
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
