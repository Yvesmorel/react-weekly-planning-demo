import { AppContext } from "@/app/context/AppContext";
import { useContext } from "react";

export const useAppContext = () => useContext(AppContext);
