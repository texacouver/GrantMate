import { useState, useEffect, useRef, useCallback } from 'react';
import { InsertGrantProposal } from '@shared/schema';

interface CollaborationState {
  isConnected: boolean;
  collaborators: Array<{
    id: number;
    userId?: number;
    guestName?: string;
    role: string;
    joinedAt: Date;
  }>;
  recentUpdates: Array<{
    field: string;
    updatedBy: string;
    timestamp: Date;
  }>;
}

interface UseCollaborationOptions {
  proposalId?: number;
  userId?: number;
  guestName?: string;
  onFieldUpdate?: (field: string, value: string, updatedBy: string) => void;
}

export function useCollaboration(options: UseCollaborationOptions) {
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    collaborators: [],
    recentUpdates: []
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Close existing connection if it exists
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setState(prev => ({ ...prev, isConnected: true }));
      
      // Join the proposal room
      if (options.proposalId) {
        ws.send(JSON.stringify({
          type: 'join_proposal',
          proposalId: options.proposalId,
          userId: options.userId,
          guestName: options.guestName
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'collaborators_update':
            setState(prev => ({
              ...prev,
              collaborators: data.collaborators
            }));
            break;
            
          case 'field_changed':
            // Update the form field
            if (options.onFieldUpdate) {
              options.onFieldUpdate(data.field, data.value, data.updatedBy);
            }
            
            // Add to recent updates
            setState(prev => ({
              ...prev,
              recentUpdates: [
                {
                  field: data.field,
                  updatedBy: data.updatedBy,
                  timestamp: new Date()
                },
                ...prev.recentUpdates.slice(0, 9) // Keep last 10 updates
              ]
            }));
            break;
            
          case 'collaborator_joined':
            setState(prev => ({
              ...prev,
              collaborators: [...prev.collaborators, data.collaborator]
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
      
      // Only reconnect if proposalId exists and connection wasn't manually closed
      if (options.proposalId && wsRef.current === ws) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [options.proposalId, options.userId, options.guestName, options.onFieldUpdate]);

  const sendFieldUpdate = useCallback((field: keyof InsertGrantProposal, oldValue: string, newValue: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'field_update',
        field,
        oldValue,
        newValue
      }));
    }
  }, []);

  useEffect(() => {
    if (options.proposalId) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [options.proposalId]); // Remove connect from dependencies to prevent reconnection loops

  return {
    ...state,
    sendFieldUpdate,
    reconnect: connect
  };
}