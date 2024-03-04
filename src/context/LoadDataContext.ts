import {createContext} from "react";

export const LoadDataContext = createContext<(() => Promise<void>) | undefined>(undefined)