import { apiSlice } from '../../app/api/apiSlice';

export interface ComprehensiveProfileNode {
  username: string;
  email: string;
  bio: string | null;
  level_id: number;
  account_visibility: 'public_profile' | 'friends_only' | 'private_profile';
  avatar_url: string | null;
  rating: number;
  cefr_level: string;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // ✅ NEW INTERFACE ENGINE: Queries comprehensive text entries on demand
    getMyProfile: builder.query<ComprehensiveProfileNode, void>({
      query: () => '/users/profile',
      providesTags: ['UserProfile'],
    }),

    updateUserProfile: builder.mutation<{ message: string; user: ComprehensiveProfileNode }, FormData>({
      query: (formData) => ({
        url: '/users/update_profile',
        method: 'PATCH',
        body: formData,
        formData: true, 
      }),
      // Automatically triggers getMyProfile to refetch fresh strings on save!
      invalidatesTags: ['UserProfile'],
    }),

    requestAccountDeletion: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/request_deletion',
        method: 'POST',
      }),
    }),

  }),
});

export const {
  useGetMyProfileQuery, // ✅ EXPORT HOOK
  useUpdateUserProfileMutation,
  useRequestAccountDeletionMutation,
} = usersApiSlice;