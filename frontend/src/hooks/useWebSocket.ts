import { useEffect, useRef, useState, useCallback } from 'react';

type MessageHandler = (data: any) => void;

export function useWebSocket(url?: string) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const handlersRef = useRef<Map<string, MessageHandler[]>>(new Map());

    const wsUrl = url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

    useEffect(() => {
        let reconnectTimer: ReturnType<typeof setTimeout>;
        let ws: WebSocket;

        function connect() {
            ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const handlers = handlersRef.current.get(data.type);
                    if (handlers) {
                        handlers.forEach((fn) => fn(data));
                    }
                    // Also fire wildcard handlers
                    const allHandlers = handlersRef.current.get('*');
                    if (allHandlers) {
                        allHandlers.forEach((fn) => fn(data));
                    }
                } catch { }
            };

            ws.onclose = () => {
                setIsConnected(false);
                reconnectTimer = setTimeout(connect, 3000);
            };

            ws.onerror = () => {
                ws.close();
            };
        }

        connect();

        return () => {
            clearTimeout(reconnectTimer);
            wsRef.current?.close();
        };
    }, [wsUrl]);

    const send = useCallback((data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    }, []);

    const on = useCallback((type: string, handler: MessageHandler) => {
        if (!handlersRef.current.has(type)) {
            handlersRef.current.set(type, []);
        }
        handlersRef.current.get(type)!.push(handler);

        return () => {
            const handlers = handlersRef.current.get(type);
            if (handlers) {
                handlersRef.current.set(type, handlers.filter((h) => h !== handler));
            }
        };
    }, []);

    return { send, on, isConnected };
}
