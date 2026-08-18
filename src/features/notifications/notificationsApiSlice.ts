// src/features/notifications/notificationsApiSlice.ts
// =========================================================================
// REAL-TIME SYSTEM NOTIFICATIONS RTK QUERY API SLICE
// =========================================================================
import { apiSlice } from '../../app/api/apiSlice';

export interface NotificationNode {
  id: number;
  event_type: string;
  actor: string;
  message: string;
  text_snippet: string;
  url: string;
  submission_id?: number | null; // Mapped JSONB key matching our Rails update
  prompt_id?: number | null;
  prompt_type?: 'writing' | 'speaking' | null;
  timestamp: string;
  read: boolean;
}

export interface NotificationsPayloadResponse {
  unread_count: number;
  notifications: NotificationNode[];
}

// src/features/notifications/notificationsApiSlice.ts

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. Fetch entire notifications payload logs array list
    // ✅ FIXED: Removed '/api/v1' so it references the root endpoint parameter string safely
    getNotificationsList: builder.query<NotificationsPayloadResponse, void>({
      query: () => '/notifications',
      // ✅ FIXED: By adding this tag description, ANY endpoint across your app that 
      // invalidates 'Notification' will auto-trigger a background refresh of this list!
      providesTags: [{ type: 'Notification', id: 'LIST' }]
    }),

    // 2. Toggle Read State (PATCH /notifications/:id)
    // ✅ FIXED: Trimmed path string
    toggleNotificationReadState: builder.mutation<{ message: string; read: boolean }, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }, { type: 'Notification', id: 'LIST' }],
    }),

    // 3. Bulk Clear Collection (POST /notifications/mark_all_as_read)
    // ✅ FIXED: Trimmed path string
    markAllNotificationsAsRead: builder.mutation<{ message: string; unread_count: number }, void>({
      query: () => ({
        url: '/notifications/mark_all_as_read',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

  }),
});

export const {
  useGetNotificationsListQuery,
  useToggleNotificationReadStateMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApiSlice;