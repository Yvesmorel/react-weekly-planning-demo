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
} from "react-weekly-planning/definitions";
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

type AddTaskTriggerPropsType = {
  currentGroup: GroupFeildsType;
  dayInfo: dayInfoType;
};

const AddTaskTrigger = ({ currentGroup, dayInfo }: AddTaskTriggerPropsType) => {
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


    // Check if task belongs to group
    if (!currentGroup.tasks.includes(clipboard.task.task)) {
      toast(`${clipboard.task.task} does not belong to this group`);
      return;
    }

    const newTask = {
      ...clipboard.task,
      taskId: Date.now().toString(),
      taskDate: dayInfo.day,
      groupId: currentGroup.id,
      dayIndex: dayInfo.positionDay,
      taskStart: newTaskStart,
      taskEnd: newTaskEnd,
    };


    // Check duplicates
    if (checkDuplicates(tasks, newTask.taskStart, newTask.taskEnd, currentGroup.id)) {
      toast("Duplicates detected");
      return;
    }



    let newTasksList = [...tasks];

    if (clipboard.action === "cut") {
      newTasksList = newTasksList.filter(t => t.taskId !== clipboard.task.taskId);
    }

    setTasks([...newTasksList, newTask]);
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
