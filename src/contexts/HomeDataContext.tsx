import { createContext, useContext } from "react";
import { UserConfig } from "../services/weddingPage.api";

export const HomeDataContext = createContext<UserConfig | undefined>(undefined);

export const useHomeData = () => useContext(HomeDataContext); 