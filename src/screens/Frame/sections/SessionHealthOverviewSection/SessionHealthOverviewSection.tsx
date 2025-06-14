import React from "react";
import { ClipboardIcon } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Switch } from "../../../../components/ui/switch";

interface SessionHealthOverviewSectionProps {
  toggleTimeline: () => void;
  showTimeline: boolean;
}



export const SessionHealthOverviewSection =  ({
  toggleTimeline,showTimeline
}: SessionHealthOverviewSectionProps): JSX.Element => {
  return (
    <Card className="w-full h-[49px] bg-[#1f1f1f] border-[#393939] rounded-none">
      <CardContent className="flex items-center justify-between p-4 h-full">
        <div className="flex items-center gap-[5px]">
          <ClipboardIcon className="w-[17px] h-[17px] text-white" />
          <div className="[font-family:'Lato',Helvetica] font-bold text-white text-sm">
            Participants wise Session Timeline
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="opacity-70 [font-family:'Lato',Helvetica] font-semibold text-white text-sm">
            Show participant timeline
          </div>
          <Switch
             checked={showTimeline} // controlled
             onCheckedChange={toggleTimeline} // correct event
            className="data-[state=checked]:bg-[#5568fe] data-[state=checked]:border-[#424fb0]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
