import {
  addTask,
  checkDuplicates,

  getSavedTasks,
} from "react-weekly-planning";
import { useAppContext } from "./context";
import { DragEvent, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { Groups as defaultGroups } from "@/app/lib/utils";
import { GroupFeildsType, TaskFeildsType, TasksType } from "react-weekly-planning";
import { useCalendarTaskContext } from "react-weekly-planning";
export const getSavedGroups = (): GroupFeildsType[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("groups");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultGroups;
      }
    }
  }
  return defaultGroups;
};

export const useTasks = () => {
  const { addTask, updateTask, getTasks, tasks: calendarTasks, deleteTask, } = useCalendarTaskContext();
  const { calendarOffset, setCalendarOffset } = useAppContext();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const { setTasks, tasks, groups, setGroups } = useAppContext();

  useEffect(() => {
    setTasks(getSavedTasks());
    setGroups(getSavedGroups());
  }, []);

  useEffect(() => {
    if (groups !== defaultGroups && groups.length > 0) {
      localStorage.setItem("groups", JSON.stringify(groups));
    }
  }, [groups]);

  useEffect(() => {
    if (tasks && tasks.length >= 0) {
      localStorage.setItem("planning_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const checkIfTaskExistInGroup = (groupId: string, task: string) => {
    return groups.find((group) => group.id === groupId)?.tasks.includes(task);
  };

  const handleDragTaskEnd = (event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = "rotate(0deg)";
    event.currentTarget.style.opacity = "1";
  };
  const handleDragTask =

    (event: DragEvent<HTMLDivElement>, currentTask: TaskFeildsType) => {
      event.currentTarget.style.transition = "0.2s";
      event.currentTarget.style.transform = "rotate(5deg)";
      event.currentTarget.style.opacity = "0.3";
    }




  const handleDropTask =
    (
      event: DragEvent<HTMLDivElement>, taskStart: number, taskEnd: number, taskDate: Date, groupId: string, dayIndex: number, newTask: TaskFeildsType, newTasks: TasksType
    ) => {

    }




  return {
    calendarDate,
    setCalendarDate,
    calendarOffset,
    setCalendarOffset,
    tasks,
    groups,
    handleDropTask,
    handleDragTaskEnd,
    handleDragTask,
  };
};
