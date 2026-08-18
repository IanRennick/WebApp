// src/features/chats/chatsApiSlice.ts
// =========================================================================
// STATELESS REAL-TIME ACTIONCABLE SUPPORT CHAT ENDPOINT SLICE
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';
import { selectCurrentToken } from '../auth/authSlice';

export interface ChatRoomResponse {
  room_id: number;
  room_name: string;
  is_private: boolean;
}

export interface ChatMessageNode {
  id: number;
  body: string;
  sender_username: string;
  is_me: boolean; // Computed dynamically or mapped locally
  user_id: number;
  timestamp: string;
}

export interface MessagesPayloadResponse {
  messages: ChatMessageNode[];
}

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 🚪 1. Fetch or initialize the 1-on-1 private helpdesk room
    getSupportRoom: builder.query<ChatRoomResponse, void>({
      query: () => '/chats/support_room',
    }),

    // 📡 2. Real-time message streaming ledger queue
    getChatMessages: builder.query<MessagesPayloadResponse, number>({
      query: (roomId) => `/chats/rooms/${roomId}/messages`,
      
      // -------------------------------------------------------------------
      // ⚡ AUTOMATED CACHE ENTRY LIFECYCLE (ACTIONCABLE WEBSOCKET BRIDGE)
      // -------------------------------------------------------------------
      async onCacheEntryAdded(roomId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
        // Establish our background socket listener pipeline variable
        let webSocketInstance: WebSocket | null = null;

        try {
          await cacheDataLoaded;
          
          // Grab the active OAuth Bearer token from our global Redux store
          const currentToken = selectCurrentToken(getState() as any);
          if (!currentToken) return;

          // ✅ FIXED: Strips out the /api/v1 subroute to ensure the WebSocket connection 
          // targets the native root ActionCable endpoint (ws://localhost:3000/cable) directly!
          const cleanBaseUrl = import.meta.env.VITE_BASE_URL.replace(/\/api\/v1\/?$/, '');
          const wsUrl = `${cleanBaseUrl.replace(/^http/, 'ws')}/cable?token=${currentToken}`;
          
          webSocketInstance = new WebSocket(wsUrl);

          // Once the socket opens, send the official ActionCable sub-protocol frame
          webSocketInstance.onopen = () => {
            const commandFrame = {
              command: 'subscribe',
              identifier: JSON.stringify({
                channel: 'ChatChannel',
                room_id: roomId
              })
            };
            webSocketInstance?.send(JSON.stringify(commandFrame));
          };

          // Handle real-time incoming text streams
          webSocketInstance.onmessage = (event) => {
            const incomingData = JSON.parse(event.data);
            if (incomingData.type === 'ping' || incomingData.type === 'welcome') return;
            
            const chatPayload = incomingData.message;
            if (chatPayload && chatPayload.id) {
              
              // ✅ FIXED LAYER: Extracts your active numerical ID safely out of global memory!
              const currentGlobalState = getState() as any;
              const currentFrontendUserId = Number(currentGlobalState.auth.user?.id || 0);
              
              updateCachedData((draft) => {
                const alreadyExists = draft.messages.some(m => m.id === chatPayload.id);
                if (!alreadyExists) {
                  draft.messages.push({
                    id: chatPayload.id,
                    body: chatPayload.body,
                    sender_username: chatPayload.sender_username,
                    user_id: Number(chatPayload.user_id),
                    timestamp: chatPayload.timestamp,
                    // ✅ FIXED MATCHING ENGINE: Compares absolute user ID integers!
                    // This guarantees that frontend messages snap onto the right blue bubble instantly,
                    // while admin replies map cleanly over onto the left grey panels immediately on arrival.
                    is_me: Number(chatPayload.user_id) === currentFrontendUserId
                  });
                }
              });

            }
          };
        } catch (err) {
          console.error("ActionCable channel injection failed:", err);
        }

        // Automatic Cleanup: When the chat bubble widget is closed, teardown the socket cleanly!
        await cacheEntryRemoved;
        if (webSocketInstance) {
          webSocketInstance.close();
        }
      }
    }),

    // ✍️ 3. Post a message to a specific room channel
    sendChatMessage: builder.mutation<ChatMessageNode, { roomId: number; body: string }>({
      query: ({ roomId, body }) => ({
        url: `/chats/rooms/${roomId}/messages`,
        method: 'POST',
        body: { body }
      }),
      // Optimistic cache update handler matches response payloads inside the local tree
      async onQueryStarted({ roomId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newMsg } = await queryFulfilled;
          dispatch(
            chatsApiSlice.util.updateQueryData('getChatMessages', roomId, (draft) => {
              const alreadyExists = draft.messages.some(m => m.id === newMsg.id);
              if (!alreadyExists) {
                draft.messages.push(newMsg);
              }
            })
          );
        } catch {}
      }
    }),

  }),
});

export const {
  useGetSupportRoomQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} = chatsApiSlice;