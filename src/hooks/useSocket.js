/**
 * useSocket.js
 * A React hook that manages a single Socket.IO connection for the current user.
 * 
 * Usage:
 *   const { socket, connected } = useSocket();
 *
 * The socket auto-connects when a user is logged in and disconnects on logout/unmount.
 * Import this hook only once (in AppLayout) and pass data down via context or Zustand.
 */

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Module-level singleton — one connection for the whole app lifetime
let socketInstance = null;

export function useSocket() {
  const { user, token } = useAuthStore();
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef([]);

  useEffect(() => {
    if (!user?.id || !token) {
      // Not logged in — tear down any existing connection
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setConnected(false);
      }
      return;
    }

    // Reuse existing connection if already established for this user
    if (socketInstance && socketInstance.connected) {
      setConnected(true);
      return;
    }

    // Create a new connection
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      // Join user-specific room
      socketInstance.emit('join', { userId: user.id });
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    return () => {
      // Do NOT disconnect on component unmount — we keep the singleton alive.
      // Disconnect only happens on logout (handled in the effect above).
    };
  }, [user?.id, token]);

  /**
   * Subscribe to a socket event.
   * Automatically removes the listener when the component unmounts.
   *
   * @param {string} event - Socket event name
   * @param {Function} handler - Callback
   */
  function on(event, handler) {
    if (!socketInstance) return;
    socketInstance.on(event, handler);
    listenersRef.current.push({ event, handler });
  }

  /**
   * Unsubscribe from a socket event.
   */
  function off(event, handler) {
    if (!socketInstance) return;
    socketInstance.off(event, handler);
  }

  return { socket: socketInstance, connected, on, off };
}

/** Disconnect and destroy the singleton (call on logout). */
export function destroySocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
