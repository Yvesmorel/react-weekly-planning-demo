import { faCode, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { ReactNode, useMemo } from "react";
import { Groups } from "../lib/utils";
import {
  GroupFeildsType,
  TaskFeildsType,
} from "react-weekly-planning/definitions";
import { millisecondsToHours } from "react-weekly-planning/lib/utils";

export const MODERN_COLORS = [
  "bg-blue-50 border-blue-400 text-blue-900 shadow-blue-100",
  "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-emerald-100",
  "bg-rose-50 border-rose-400 text-rose-900 shadow-rose-100",
  "bg-amber-50 border-amber-400 text-amber-900 shadow-amber-100",
  "bg-purple-50 border-purple-400 text-purple-900 shadow-purple-100",
  "bg-orange-50 border-orange-400 text-orange-900 shadow-orange-100",
  "bg-teal-50 border-teal-400 text-teal-900 shadow-teal-100",
  "bg-pink-50 border-pink-400 text-pink-900 shadow-pink-100",
];

export const getTaskColorClass = (task: TaskFeildsType) => {
  const str = `${task.id}-${task.task}-${task.groupId}-${task.taskStart}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MODERN_COLORS[Math.abs(hash) % MODERN_COLORS.length];
};

// Group rendering component

export const GroupRender = ({
  currentGroup,
}: {
  currentGroup: GroupFeildsType;
}) => {


  return (
    <div className="w-full h-full flex items-center p-4 gap-4">
      <Avatar shape="square" src={currentGroup.imageUrl}>
        {currentGroup.label && currentGroup.label[0]}
      </Avatar>
      <label>{currentGroup.label}</label>
    </div>
  );
};

// Groups header rendering component
export const GroupsHeadRender = () => (
  <div className="w-full h-[50px] text-left flex items-center">
    My Activities
  </div>
);

export const TaskContainer = ({
  currentTask,
}: {
  currentTask: TaskFeildsType;
}): ReactNode => {

  const task = Groups.find((group) => group.id === currentTask.groupId);

  const colorClass = useMemo(() => getTaskColorClass(currentTask), [currentTask]);

  return (
    <div
      className={`w-full h-full border-l-4  flex flex-col justify-center px-3 py-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClass}`}

    >
      <div className="flex items-center gap-2 mb-1">
        {
          <FontAwesomeIcon
            style={{ color: task?.color }}
            icon={task?.type === "code" ? faCode : faNotesMedical}
            className="text-sm"
          />
        }
        <p className="text-xs font-semibold opacity-80">
          {`${millisecondsToHours(currentTask.taskStart)} - ${millisecondsToHours(
            currentTask.taskEnd
          )}`}
        </p>
      </div>

      <p className="text-sm font-medium leading-tight line-clamp-2">{currentTask.task}</p>
    </div>
  );
};
