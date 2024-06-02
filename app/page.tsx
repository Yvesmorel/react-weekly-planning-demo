"use client";

import { useState, Dispatch, SetStateAction } from "react";
import Calendar, {
  millisecondsToHours,
  checkDuplicates,
  updateOffsetWithDateCalendar,
  updateCalendarDateWithOffset,
} from "react-weekly-planning";
import { Avatar, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  GroupFeildsType,
  TaskFeildsType,
} from "react-weekly-planning/definitions";
import { Button } from "@/components/ui/button";
import { UseAppContext } from "@/context/AppContext";
import { Toaster, toast } from "sonner";
import { montserrat, rublik } from "./ui/font";
import AddTaskTigger from "./ui/add-task-tigger";
import { faCode, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Group rendering comp..nent
const GroupRender = ({ currentGroup }: { currentGroup: GroupFeildsType }) => (
  <div className="w-full h-full flex items-center p-4 gap-4">
    <Avatar shape="square" src={currentGroup.imageUrl}>
      {currentGroup.label && currentGroup.label[0]}
    </Avatar>
    <label>{currentGroup.label}</label>
  </div>
);

// Groups header rendering component
const GroupsHeadRender = () => (
  <div className="w-full h-[50px] text-left flex items-center">
    My Activities
  </div>
);

// Home component
export default function Home() {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarOffset, setCalendarOffset] = useState<number>(0);
  const { tasks, setTasks } = UseAppContext();
  const [Groups] = useState([
    {
      id: "1",
      label: "ReactJS",
      imageUrl: "./react.svg",
      tasks: ["Hooks", "Context API", "Redux", "React-memo"],
      type: "code",
      color: "#01a3c0d1",
    },
    {
      id: "2",
      label: "JavaScript",
      imageUrl: "./javascript.svg",
      tasks: ["Class", "Promise", "Strict mode", "Closures"],
      type: "code",
      color: "#cdbb28",
    },
    {
      id: "3",
      label: "Sport",
      imageUrl: "./sport.svg",
      tasks: ["push ups", "stretching"],
      type: "health",
      color: "#FA7070",
    },
  ]);

  const TaskContainer = ({ currentTask }: { currentTask: TaskFeildsType }) => {
    const task = Groups.find((group) => group.id === currentTask.groupId);
    return (
      <div className="bg-white w-full h-full border-l-[6px] border-[#457993] flex flex-col justify-center pl-1 relative">
        <div className="-">
          {
            <FontAwesomeIcon
              style={{ color: task?.color }}
              icon={task?.type === "code" ? faCode : faNotesMedical}
            />
          }
        </div>
        <p className="font-semibold">
          {`${millisecondsToHours(
            currentTask.taskStart
          )} - ${millisecondsToHours(currentTask.taskEnd)}`}
        </p>

        <p>{currentTask.task}</p>
      </div>
    );
  };

  const checkIfTaskExistInGroup = (groupId: string, task: string) => {
    return Groups.find((group) => group.id === groupId)?.tasks.includes(task);
  };

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
            handleDragTask={(event, currentTask) => {
              event.currentTarget.style.transition = "0.2s";
              event.currentTarget.style.transform = "rotate(5deg)";
              event.currentTarget.style.opacity = "0.3";
            }}
            handleDragTaskEnd={(event) => {
              event.currentTarget.style.transform = "rotate(0deg)";
              event.currentTarget.style.opacity = "1";
            }}
            taskRender={TaskContainer}
            handleDropTask={(
              event,
              taskStart,
              taskEnd,
              taskDate,
              groupId,
              dayIndex,
              newTask,
              newTasks
            ) => {
              if (!checkIfTaskExistInGroup(groupId, newTask.task)) {
                toast(
                  `${newTask.task} does not belong to the tasks of this group`
                );
                return;
              }
              if (checkDuplicates(tasks, taskStart, taskEnd, newTask.groupId)) {
                toast("Duplicates detected");
                return;
              }
              setTasks(newTasks);
            }}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}

// Actions component
type ActionsPropsType = {
  setCalendarDate: Dispatch<SetStateAction<Date>>;
  calendarDate: Date;
  setCalendarOffset: Dispatch<SetStateAction<number>>;
  calendarOffset: number;
};

const Actions = ({
  setCalendarDate,
  calendarDate,
  setCalendarOffset,
  calendarOffset,
}: ActionsPropsType) => {
  const handleChangeCalendarDate = (value: dayjs.Dayjs) => {
    setCalendarDate(value.toDate());
    const newOffset = updateOffsetWithDateCalendar(value.toDate());
    setCalendarOffset(newOffset);
  };

  const handleChangeOffset = (offset: number) => {
    const newOffset = calendarOffset + offset;
    const newCalendarDate = updateCalendarDateWithOffset(offset, calendarDate);
    setCalendarOffset(newOffset);
    setCalendarDate(newCalendarDate);
  };

  function weekFormat(value: dayjs.Dayjs) {
    const startOfWeek = value.startOf("week").format("DD MMM YYYY");
    const endOfWeek = value.endOf("week").format("DD MMM YYYY");
    return `${startOfWeek} - ${endOfWeek}`;
  }

  return (
    <div className="w-full h-[50px] flex p-2 items-center justify-between">
      <DatePicker
        value={dayjs(calendarDate)}
        onChange={handleChangeCalendarDate}
        picker="week"
        format={weekFormat}
      />
      <div className="w-auto h-auto flex gap-2">
        <Button className="bg-[#f2f8fb]" onClick={() => handleChangeOffset(-7)} variant="secondary">
          Previous week
        </Button>
        <Button className="bg-[#f2f8fb]" onClick={() => handleChangeOffset(+7)} variant="secondary">
          Next week
        </Button>
      </div>
    </div>
  );
};
