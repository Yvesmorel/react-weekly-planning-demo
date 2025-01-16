"use client";
import { Groups } from "./lib/utils";
import Calendar from "react-weekly-planning";
import Actions from "./components/navigate-actions";
import { Toaster } from "sonner";
import { montserrat, rublik } from "./components/font";
import AddTaskTigger from "./components/create-task/add-task-tigger";
import {
  GroupRender,
  GroupsHeadRender,
  TaskContainer,
} from "./components/calendar-render-components";
import { useTasks } from "./components/custom-hooks/useTask";

// Home component

export default function Home() {
  const {
    calendarDate,
    setCalendarDate,
    calendarOffset,
    setCalendarOffset,
    tasks,
    handleDropTask,
    handleDragTask,
    handleDragTaskEnd,
  } = useTasks();

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between ">
      <div className="w-full h-full flex flex-col">
        <Actions
          setCalendarOffset={setCalendarOffset}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          calendarOffset={calendarOffset}
        />

        <div className="w-full flex flex-1 overflow-auto bg-[#f2f8f8]">
          <Calendar
            className={`${rublik.className} rounded border-t calendar`}
            taskContainerStyle={{ border: "none", zIndex: 10 }}
            groupsColsStyle={{ width: "100px" }}
            tasks={tasks}
            groupsHeadRender={GroupsHeadRender}
            dayClassName={`${montserrat.className} text-left pl-2`}
            groups={Groups}
            date={calendarDate}
            weekOffset={calendarOffset}
            groupRender={GroupRender}
            addTaskRender={AddTaskTigger}
            handleDragTask={handleDragTask}
            handleDragTaskEnd={handleDragTaskEnd}
            // taskRender={TaskContainer}
            handleDropTask={handleDropTask}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
