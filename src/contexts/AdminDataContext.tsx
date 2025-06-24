import { createContext, useContext } from "react";
import { UserProfile } from "../services/api";

export const AdminDataContext = createContext<UserProfile | undefined>(undefined);

export const useAdminData = () => useContext(AdminDataContext); 