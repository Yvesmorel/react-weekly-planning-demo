"use client";
import { Calendar } from "react-weekly-planning";
import Actions from "./components/navigate-actions";
import { Toaster } from "sonner";
import { montserrat, rublik } from "./components/font";
import AddTaskTigger from "./components/create-task/add-task-tigger";
import {
  GroupRender,
  getTaskColorClass,
  GroupsHeadRender,
  TaskContainer,
} from "./components/calendar-render-components";
import { useTasks } from "./components/custom-hooks/useTask";
import { useEffect, useMemo, useState } from "react";

import AddGroupDialog from "./components/create-group/create-group-dialog";

// Home component

export default function Home() {
  const {
    calendarDate,
    setCalendarDate,
    calendarOffset,
    setCalendarOffset,
    tasks,
    groups,
    handleDropTask,
    handleDragTask,
    handleDragTaskEnd,
  } = useTasks();

  const [scope, setScope] = useState<"week" | "day">("week");
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
        setScope("day");
        setGroupColWidth(window.innerWidth < 640 ? "80px" : "120px");
      } else {
        setScope("week");
        setGroupColWidth("150px");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between ">
      <div className="w-full h-full flex flex-col">
        <Actions
          setCalendarOffset={setCalendarOffset}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          calendarOffset={calendarOffset}
          scope={scope}
        />

        <div className="w-full flex flex-1 overflow-auto ">
          <style>{`
            .calendar thead tr:first-child {
              background-color: ${dominantColorClass.includes('blue') ? '#eff6ff' :
              dominantColorClass.includes('emerald') ? '#ecfdf5' :
                dominantColorClass.includes('rose') ? '#fff1f2' :
                  dominantColorClass.includes('amber') ? '#fffbeb' :
                    dominantColorClass.includes('purple') ? '#faf5ff' :
                      dominantColorClass.includes('orange') ? '#fff7ed' :
                        dominantColorClass.includes('teal') ? '#f0fdfa' :
                          dominantColorClass.includes('pink') ? '#fdf2f8' : 'white'
            } !important;
              transition: background-color 0.5s ease;
            }
          `}</style>
          <Calendar
            className={`${rublik.className} rounded border-t calendar`}
            taskContainerStyle={{ border: "none", zIndex: 10, borderRadius: "10px", overflow: "hidden" }}
            groupsColsStyle={{ width: groupColWidth }}
            tasks={tasks}
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
            addTaskRender={AddTaskTigger}
            handleDragTask={handleDragTask}
            handleDragTaskEnd={handleDragTaskEnd}
            scope={scope}
            timeZone="Africa/Abidjan"
            taskRender={TaskContainer}
            handleDropTask={handleDropTask}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
