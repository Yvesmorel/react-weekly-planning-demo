import { faCode, faNotesMedical, faCopy, faScissors, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import { ReactNode, useMemo } from "react";

import { updateOffsetWithDateCalendar, useCalendarTaskContext } from "react-weekly-planning";
import { useAppContext } from "./custom-hooks/context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { useTasks } from "./custom-hooks/useTask";
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
  // Use task.hash or taskDate to ensure unique color per day
  const dateStr = task.hash || (task.taskDate ? new Date(task.taskDate).toDateString() : task.dayIndex?.toString() || '0');
  const str = `day-color-${dateStr}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MODERN_COLORS[Math.abs(hash) % MODERN_COLORS.length];
};

import AddGroupDialog from "./create-group/create-group-dialog";
import { GroupFeildsType, millisecondsToHours, TaskFeildsType } from "react-weekly-planning";

const AVATAR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F06292", "#AED581", "#FFD54F", "#4DB6AC", "#7986CB",
  "#9575CD", "#4FC3F7", "#81C784", "#DCE775", "#FF8A65"
];

const getAvatarColor = (label: string) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Group rendering component

export const GroupRender = ({
  currentGroup,
}: {
  currentGroup: GroupFeildsType;
}) => {


  return (
    <div className="w-full h-full flex items-start p-2 sm:p-4 gap-2 sm:gap-4 group cursor-pointer relative overflow-hidden">
      <Avatar
        shape="square"
        src={currentGroup.imageUrl}
        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
        style={{ backgroundColor: getAvatarColor(currentGroup.label || ""), verticalAlign: 'middle', border: 'none' }}
      >
        {currentGroup.label && currentGroup.label[0]}
      </Avatar>
      <div className="flex flex-1 items-center justify-between min-w-0">
        <label className="cursor-pointer font-medium truncate text-xs sm:text-sm">{currentGroup.label}</label>
        <AddGroupDialog groupToEdit={currentGroup} />
      </div>
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
  const { calendarOffset, setCalendarOffset } = useAppContext();
  const { deleteTask } = useCalendarTaskContext();
  const { groups, tasks, setTasks, setClipboard, clipboard } = useAppContext();
  const taskGroup = groups.find((group) => group.id === currentTask.groupId);

  const colorClass = useMemo(() => getTaskColorClass(currentTask), [currentTask]);

  const isInClipboard = clipboard?.task?.id === currentTask.id;
  const isCut = isInClipboard && clipboard?.action === "cut";

  const animationClass = `task-container-anim ${isInClipboard ? "task-in-clipboard" : ""} ${isCut ? "task-cut-state" : ""}`;

  const handleCopy = () => {
    setClipboard({ task: currentTask, action: "copy" });
    toast("Task copied to clipboard");
  };

  const handleCut = () => {
    setClipboard({ task: currentTask, action: "cut" });
    toast("Task cut to clipboard");
  };

  const handleDelete = () => {
    if (currentTask.hash) deleteTask(currentTask.hash, currentTask.id);
    toast("Task deleted");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        <div
          className={`w-full h-full border-l-2 sm:border-l-4 flex flex-col justify-center px-1.5 sm:px-3 py-1 sm:py-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClass} overflow-hidden`}
        >
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1" onClick={() => console.log(currentTask)}>
            <FontAwesomeIcon
              style={{ color: taskGroup?.color }}
              icon={taskGroup?.type === "code" ? faCode : faNotesMedical}
              className="text-[10px] sm:text-sm"
            />
            <p className="text-[9px] sm:text-xs font-semibold opacity-80 whitespace-nowrap">
              {`${millisecondsToHours(currentTask.taskStart)} - ${millisecondsToHours(
                currentTask.taskEnd
              )}`}
            </p>
          </div>

          <p className="text-[10px] sm:text-sm font-medium leading-tight line-clamp-1 sm:line-clamp-2 break-words">
            {currentTask.task}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy} className="gap-2">
          <FontAwesomeIcon icon={faCopy} className="w-3 h-3" />
          <span>Copy</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCut} className="gap-2">
          <FontAwesomeIcon icon={faScissors} className="w-3 h-3" />
          <span>Cut</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="gap-2 text-red-600 focus:text-red-600">
          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
