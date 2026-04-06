"use client";
import { Calendar } from "react-weekly-planning";
import Actions from "./components/navigate-actions";
import { Toaster } from "sonner";
import { montserrat, rublik } from "./components/font";
import AddTaskTigger from "./components/create-task/add-task-tigger";
import { getCalendarDate } from "react-weekly-planning";
import CalendarTaskContextProvider, { useCalendarTaskContext } from "react-weekly-planning/contexts/CalendarTaskContext";
// After the Calendar component has been rendered once:
const now = getCalendarDate();
import {
  GroupRender,
  getTaskColorClass,
  GroupsHeadRender,
  TaskContainer,
} from "./components/calendar-render-components";
import { useTasks } from "./components/custom-hooks/useTask";
import { useEffect, useMemo, useState } from "react";

import AddGroupDialog from "./components/create-group/create-group-dialog";
import { useAppContext } from "./components/custom-hooks/context";

// Home component

export default function Home() {
  const {
    calendarDate,
    setCalendarDate,
    calendarOffset,
    setCalendarOffset,
    tasks,
    groups,
    handleDragTask,
    handleDragTaskEnd,
  } = useTasks();


  const { getTasks, tasks: calendarTasks } = useCalendarTaskContext();
  const { dayOffset, setDayOfset } = useAppContext();
  const [groupColWidth, setGroupColWidth] = useState("150px");

  const dominantColorClass = useMemo(() => {
    if (!tasks || tasks.length === 0) return "bg-white";

    const colorCounts: Record<string, number> = {};
    tasks.forEach((task: any) => {
      const colorClass = getTaskColorClass(task);
      // Remove text and border classes to keep only background
      const bgColor = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-white';
      colorCounts[bgColor] = (colorCounts[bgColor] || 0) + 1;
    });

    let maxCount = 0;
    let dominantColor = "bg-white";

    for (const [color, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }

    return dominantColor;
  }, [tasks]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setGroupColWidth(window.innerWidth < 640 ? "80px" : "120px");
      } else {
        setGroupColWidth("150px");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (

    < div className="flex w-screen h-screen flex-col items-center  " >
      <div className="w-full">
        <Actions
          setCalendarOffset={setCalendarOffset}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          calendarOffset={calendarOffset}
        />
      </div>

      <Calendar
        className={`${rublik.className} rounded border-t calendar`}
        taskContainerStyle={{ border: "none", zIndex: 10, borderRadius: "10px", overflow: "hidden" }}
        groupsColsStyle={{ width: groupColWidth }}

        groupsHeadRender={() => (
          <div
            className={`w-full h-full text-left flex justify-between items-center px-2 sm:px-4 font-bold transition-colors duration-500 text-xs sm:text-base ${dominantColorClass.replace('bg-', 'text-').replace('-50', '-900')}`}
          >
            <span className="truncate">Activities</span>
            <AddGroupDialog />
          </div>
        )}
        dayClassName={`${montserrat.className} text-left pl-2 text-xs sm:text-sm`}
        groups={groups}
        date={calendarDate}
        weekOffset={calendarOffset}
        groupRender={GroupRender}
        addTaskRender={(props) => {
          return <AddTaskTigger {...props} />
        }}
        handleDragTask={handleDragTask}
        handleDragTaskEnd={handleDragTaskEnd}
        taskRender={TaskContainer}
      />



    </div >

  );
}
