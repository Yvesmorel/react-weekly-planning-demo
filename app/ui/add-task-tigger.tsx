"use client";

import { useState } from "react";
import { calculateTimeOfDayRange, CustomDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  dayInfoType,
  GroupFeildsType,
} from "react-weekly-planning/definitions";
import CreatePlanningContainer from "./create-task-container";

type AddTaskTriggerPropsType = {
  currentGroup: GroupFeildsType;
  dayInfo: dayInfoType;
};

const AddTaskTrigger = ({ currentGroup, dayInfo }: AddTaskTriggerPropsType) => {
  const [timeOfdayRange, setTimeOfdayRange] = useState<number[]>([]);

  const handleAddPlanning = () => {
    const range = calculateTimeOfDayRange(dayInfo.start, dayInfo.end);
    setTimeOfdayRange(range);
  };

  const currentDayDate = CustomDate(dayInfo.day.toDateString());

  return (
    <Dialog>
      <DialogTrigger
        onClick={handleAddPlanning}
        className="w-full flex-1 bg-[#f2f8fb] opacity-0 rounded-[5px] hover:bg-[#c6dbe159] hover:opacity-100"
      >
        <FontAwesomeIcon icon={faAdd} className="text-[#0f5173] w-[10px] h-[10px]" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>{currentDayDate}</DialogDescription>
        </DialogHeader>
        <CreatePlanningContainer
          timeOfdayRange={timeOfdayRange}
          currentGroup={currentGroup}
          dayInfo={dayInfo}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskTrigger;
