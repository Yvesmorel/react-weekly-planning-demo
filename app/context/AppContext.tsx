import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import { TasksType, GroupFeildsType, TaskFeildsType } from "react-weekly-planning/definitions";

type AppContextType = {
  tasks: TasksType;
  setTasks: Dispatch<SetStateAction<TasksType>>;
  groups: GroupFeildsType[];
  setGroups: Dispatch<SetStateAction<GroupFeildsType[]>>;
  clipboard: { task: TaskFeildsType; action: "copy" | "cut" } | null;
  setClipboard: Dispatch<SetStateAction<{ task: TaskFeildsType; action: "copy" | "cut" } | null>>;
};

export const AppContext = createContext<AppContextType>({
  tasks: [],
  setTasks: () => {},
  groups: [],
  setGroups: () => {},
  clipboard: null,
  setClipboard: () => {},
});

export default function AppContextProvider({ children }: { children: JSX.Element }) {
  const [tasks, setTasks] = useState<TasksType>([]);
  const [groups, setGroups] = useState<GroupFeildsType[]>([]);
  const [clipboard, setClipboard] = useState<{ task: TaskFeildsType; action: "copy" | "cut" } | null>(null);

  return (
    <AppContext.Provider value={{ tasks, setTasks, groups, setGroups, clipboard, setClipboard }}>
      {children}
    </AppContext.Provider>
  );
}

