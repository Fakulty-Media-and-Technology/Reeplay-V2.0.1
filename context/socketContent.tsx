import { useAppSelector } from '@/Hooks/reduxHook';
import {selectUser} from '@/store/slices/userSlice';
import { appPersistStorage, appPersistStoreName, AppPersistStoreStateType } from '@/store/zustand.store';
import React, {
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import {io, Socket} from 'socket.io-client';

// Define the context type
export interface SocketContextType {
  socket: Socket;
}

// Create the context with undefined initial value
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {

  // Initialize the socket once using useRef to avoid re-creation on each render
  const socket = io('https://typescript.reeplay.app');

  useEffect(() => {

    // Authenticate and connect the socket
    socket.connect();

    socket.on('connect', () => {
      console.log('socket is connected');
    });

    socket.on('online', (data: string[]) => {
      console.log(data, 'ONLINE PEOPLE from server');
    });

    return () => {
      // socket.disconnect(); // Cleanup on unmount
      // socketLivestream.disconnect(); // Cleanup on unmount
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};
