import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import { GroupFeildsType, TaskContainerPropsType, TaskFeildsType, TasksType } from "react-weekly-planning";

type AppContextType = {
  tasks: TasksType;
  setTasks: Dispatch<SetStateAction<TasksType>>;
  groups: GroupFeildsType[];
  setGroups: Dispatch<SetStateAction<GroupFeildsType[]>>;
  clipboard: { task: TaskFeildsType; action: "copy" | "cut" } | null;
  setClipboard: Dispatch<SetStateAction<{ task: TaskFeildsType; action: "copy" | "cut" } | null>>;
  calendarOffset: number;
  setCalendarOffset: Dispatch<SetStateAction<number>>;
  dayOffset?: 0 | 2 | 1 | 3 | 4 | 5 | 6;
  setDayOfset: Dispatch<SetStateAction<0 | 2 | 1 | 3 | 4 | 5 | 6 | undefined>>;
};

export const AppContext = createContext<AppContextType>({
  tasks: [],
  setTasks: () => { },
  groups: [],
  setGroups: () => { },
  clipboard: null,
  setClipboard: () => { },
  calendarOffset: 0,
  setCalendarOffset: () => { },
  dayOffset: 0,
  setDayOfset: () => { },
});

export default function AppContextProvider({ children }: { children: JSX.Element }) {
  const [tasks, setTasks] = useState<TasksType>([]);
  const [groups, setGroups] = useState<GroupFeildsType[]>([]);
  const [clipboard, setClipboard] = useState<{ task: TaskFeildsType; action: "copy" | "cut" } | null>(null);
  const [calendarOffset, setCalendarOffset] = useState<number>(0);
  const [dayOffset, setDayOfset] = useState<0 | 2 | 1 | 3 | 4 | 5 | 6 | undefined>(0);
  return (
    <AppContext.Provider value={{ dayOffset, setDayOfset, tasks, setTasks, groups, setGroups, clipboard, setClipboard, calendarOffset, setCalendarOffset }}>
      {children}
    </AppContext.Provider>
  );
}

