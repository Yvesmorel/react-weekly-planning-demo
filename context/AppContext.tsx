import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import { TasksType } from "react-weekly-planning/definitions";

type AppContextType = {
  tasks: TasksType;
  setTasks: Dispatch<SetStateAction<TasksType>>;
};

const AppContext = createContext<AppContextType>({
  tasks: [],
  setTasks: () => {},
});

export default function AppContextProvider({ children }: { children: JSX.Element }) {
  const [tasks, setTasks] = useState<TasksType>([]);

  return (
    <AppContext.Provider value={{ tasks, setTasks }}>
      {children}
    </AppContext.Provider>
  );
}

export const UseAppContext = () => useContext(AppContext);
