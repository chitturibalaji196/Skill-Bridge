import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import { API_URL } from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user, token } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Derive the base socket URL from API_URL (removing the /api suffix)
        const socketUrl = API_URL.replace('/api', '');
        const socketClient = io(socketUrl, {
            autoConnect: false,
            transports: ['websocket'],
            auth: {
                token,
            },
        });

        socketClient.auth = { token, user }; // keep user available if needed

        socketClient.on('connect', () => {
            console.info('Socket connected', socketClient.id);
        });

        socketClient.on('connect_error', (err) => {
            console.error('Socket connect error', err);
        });

        socketClient.on('disconnect', (reason) => {
            console.info('Socket disconnected', reason);
        });

        socketClient.connect();
        setSocket(socketClient);

        return () => {
            socketClient.disconnect();
            setSocket(null);
        };
    }, [token, user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected: socket?.connected ?? false }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export default SocketContext;
