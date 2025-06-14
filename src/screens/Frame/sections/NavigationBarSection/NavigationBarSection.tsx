import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import dayjs from "dayjs";


interface NavigationBarSectionProps {
  startTime: string;
  endTime: string;
}
export const NavigationBarSection = ({
  startTime,
  endTime,
}: NavigationBarSectionProps): JSX.Element => {
  const generateTimeMarkers = (start: string, end: string): string[] => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const markers: string[] = [];

    let current = startTime;
    while (current.isBefore(endTime)) {
      markers.push(current.format("HH:mm"));
      current = current.add(1, "minute");
    }

    return markers;
  };

  const timeMarkers = generateTimeMarkers(startTime, endTime);
  return (
    <nav className="w-full py-4 relative">
      {/* Container with proper padding to prevent first item from being cut off */}
      <div className="px-6 overflow-x-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <Tabs defaultValue={timeMarkers[0]} className="w-full">
          <TabsList className="inline-flex gap-[75px] h-auto bg-transparent p-0 min-w-max">
            {timeMarkers.map((time, index) => (
              <TabsTrigger
                key={`${time}-${index}`}
                value={time}
                className="[font-family:'Lato',Helvetica] font-bold text-[#666666] text-sm data-[state=active]:bg-transparent data-[state=active]:text-[#5568fe] data-[state=active]:shadow-none px-0 py-0 whitespace-nowrap flex-shrink-0"
              >
                {time}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </nav>
  );
};
