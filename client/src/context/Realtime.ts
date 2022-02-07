import { createContext } from "react";
import Chat from "realtime/Chat";
const temp: any = null;

export const chatContext = createContext<Chat|null>(temp);
