import {
  checkDuplicates,
  getSavedTasks,
} from "react-weekly-planning/lib/utils";
import { useAppContext } from "./context";
import { DragEvent, useEffect, useState } from "react";
import { Groups } from "@/app/lib/utils";
import { TaskFeildsType, TasksType } from "react-weekly-planning/definitions";
import { toast } from "sonner";
import { useCallback } from "react";

export const useTasks = () => {

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarOffset, setCalendarOffset] = useState<number>(0);
  const { setTasks, tasks } = useAppContext();

  useEffect(() => {
    setTasks(getSavedTasks());
  }, []);

  const checkIfTaskExistInGroup = (groupId: string, task: string) => {
    return Groups.find((group) => group.id === groupId)?.tasks.includes(task);
  };

  const handleDragTaskEnd = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = "rotate(0deg)";
    event.currentTarget.style.opacity = "1";
  }, []);
  const handleDragTask = useCallback(
    
    (event: DragEvent<HTMLDivElement>, currentTask: TaskFeildsType) => {
      event.currentTarget.style.transition = "0.2s";
      event.currentTarget.style.transform = "rotate(5deg)";
      event.currentTarget.style.opacity = "0.3";
    },
    []
  );
  const handleDropTask = useCallback(
    (
      event: React.DragEvent<HTMLTableDataCellElement>,
      taskStart: number,
      taskEnd: number,
      taskDate: Date,
      groupId: string,
      dayIndex: number,
      newTask: TaskFeildsType,
      newTasks: TasksType
    ) => {
      if (!checkIfTaskExistInGroup(groupId, newTask.task)) {
        toast(`${newTask.task} does not belong to the tasks of this group`);
        return;
      }
      if (checkDuplicates(tasks, taskStart, taskEnd, newTask.groupId)) {
        toast("Duplicates detected");
        return;
      }
      setTasks(newTasks);
    },
    []
  );

  return {
    calendarDate,
    setCalendarDate,
    calendarOffset,
    setCalendarOffset,
    tasks,
    handleDropTask,
    handleDragTaskEnd,
    handleDragTask,
  };
};
