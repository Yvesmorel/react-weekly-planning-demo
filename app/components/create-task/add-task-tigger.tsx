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
import { faAdd, faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  dayInfoType,
  GroupFeildsType,
  updateOffsetWithDateCalendarForWeek,
  useCalendarTaskContext,
} from "react-weekly-planning";
import CreatePlanningContainer from "./create-task-container";
import { DragEvent } from "react";
import { useAppContext } from "../custom-hooks/context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { checkDuplicates } from "react-weekly-planning";
import { v4 as uuidv4 } from 'uuid';
import { useTasks } from "../custom-hooks/useTask";

type AddTaskTriggerPropsType = {
  currentGroup: GroupFeildsType;
  dayInfo: dayInfoType;
};

const AddTaskTrigger = ({ currentGroup, dayInfo }: AddTaskTriggerPropsType) => {
  const { calendarOffset, setCalendarOffset } = useAppContext();
  const { updateTask, addTask, deleteTask, tasks: calendarTasks } = useCalendarTaskContext();
  const tiggerHoverClassName = 'w-full flex-1 bg-[#c6dbe159] rounded-[5px]';
  const tiggerClassName = "w-full flex-1 bg-[#f2f8fb] opacity-0 rounded-[5px] hover:bg-[#c6dbe159] hover:opacity-100"
  const [timeOfdayRange, setTimeOfdayRange] = useState<number[]>([]);
  const { clipboard, setClipboard, tasks, setTasks } = useAppContext();

  const handleAddPlanning = () => {
    const range = calculateTimeOfDayRange(dayInfo.start, dayInfo.end);
    setTimeOfdayRange(range);
  };

  const handlePaste = () => {
    if (!clipboard) return;

    const originalDayStartTime = new Date(clipboard.task.taskDate).setHours(0, 0, 0, 0);
    const offsetFromDayStart = clipboard.task.taskStart - originalDayStartTime;
    const duration = clipboard.task.taskEnd - clipboard.task.taskStart;

    const newDayStartTime = new Date(dayInfo.day).setHours(0, 0, 0, 0);
    const newTaskStart = newDayStartTime + offsetFromDayStart;
    const newTaskEnd = newTaskStart + duration;


    const newTask = {
      ...clipboard.task,

      taskDate: dayInfo.day,
      groupId: currentGroup.id,
      dayIndex: dayInfo.positionDay,
      taskStart: newTaskStart,
      taskEnd: newTaskEnd,
    };





    if (clipboard.action === "cut") {
      if (clipboard.task.hash) deleteTask(clipboard.task.hash, clipboard.task.id);
      addTask({ ...newTask, id: clipboard.task.id });

    }




    if (clipboard.action === "copy") addTask({ ...newTask, id: uuidv4() });
    setClipboard(null);
    toast(`Task ${clipboard.action === "cut" ? "moved" : "pasted"} successfully`);
  };


  const currentDayDate = CustomDate(dayInfo.day.toDateString());


  const handleDragEnter = (event: DragEvent<HTMLButtonElement>) => {
    event.currentTarget.className = tiggerHoverClassName
  }
  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.currentTarget.className = tiggerClassName
  }
  const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
    event.currentTarget.className = tiggerClassName
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full flex-1 flex">
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          disabled={!clipboard}
          onClick={handlePaste}
          className="gap-2"
        >
          <FontAwesomeIcon icon={faPaste} className="w-3 h-3" />
          <span>Paste</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default AddTaskTrigger;
