"use client";

import { useState } from "react";
import { calculateTimeOfDayRange, CustomDate } from "@/app/lib/utils";
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
import { DragEvent } from "react";
type AddTaskTriggerPropsType = {
  currentGroup: GroupFeildsType;
  dayInfo: dayInfoType;
};

const AddTaskTrigger = ({ currentGroup, dayInfo }: AddTaskTriggerPropsType) => {
  const tiggerHoverClassName='w-full flex-1 bg-[#c6dbe159] rounded-[5px]';
  const tiggerClassName="w-full flex-1 bg-[#f2f8fb] opacity-0 rounded-[5px] hover:bg-[#c6dbe159] hover:opacity-100"
  const [timeOfdayRange, setTimeOfdayRange] = useState<number[]>([]);

  const handleAddPlanning = () => {
    const range = calculateTimeOfDayRange(dayInfo.start, dayInfo.end);
    setTimeOfdayRange(range);
  };

  const currentDayDate = CustomDate(dayInfo.day.toDateString());

  
  const handleDragEnter=(event:DragEvent<HTMLButtonElement>)=>{
    event.currentTarget.className=tiggerHoverClassName
  }
  const handleDragLeave=(event:DragEvent<HTMLButtonElement>)=>{
    event.currentTarget.className=tiggerClassName
  }
  const handleDragEnd=(event:DragEvent<HTMLButtonElement>)=>{
    event.currentTarget.className=tiggerClassName
  }

  return (
    <Dialog>
      <DialogTrigger
        
        onClick={handleAddPlanning}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={tiggerClassName}
    
      >
        <FontAwesomeIcon
          icon={faAdd}
          className="text-[#0f5173] w-[10px] h-[10px]"
        />
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
