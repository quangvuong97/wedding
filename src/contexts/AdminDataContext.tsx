import { createContext, useContext } from "react";
import { UserProfile } from "../services/api";

type AdminContextType = {
  adminData: UserProfile | undefined;
  setAdminData: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
};

export const AdminDataContext = createContext<AdminContextType>({
  adminData: undefined,
  setAdminData: undefined as any,
});

export const useAdminData = () => useContext(AdminDataContext);
