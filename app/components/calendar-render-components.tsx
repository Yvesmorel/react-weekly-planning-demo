import { faCode, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { ReactNode } from "react";
import { Groups } from "../lib/utils";
import {
  GroupFeildsType,
  TaskFeildsType,
} from "react-weekly-planning/definitions";
import { millisecondsToHours } from "react-weekly-planning/lib/utils";

// Group rendering component

export const GroupRender = ({
  currentGroup,
}: {
  currentGroup: GroupFeildsType;
}) => {
  console.log(currentGroup.label, "se me rend");

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
  console.log(currentTask.task, "____se rend");

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
        {`${millisecondsToHours(currentTask.taskStart)} - ${millisecondsToHours(
          currentTask.taskEnd
        )}`}
      </p>

      <p>{currentTask.task}</p>
    </div>
  );
};
