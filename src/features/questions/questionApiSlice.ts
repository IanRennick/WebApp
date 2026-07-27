import { apiSlice } from '../../app/api/apiSlice';

export interface ForumComment {
  id: number;
  parent_id: number | null;
  author: string;
  body: string;
  timestamp: string;
  replies: ForumComment[];
}

export interface QuestionData {
  id: number;
  level: string;        
  kind: number;         
  subtype: number | null;
  main: string;         
  tags: string[];       
  comments: ForumComment[]; 
  options?: string[];   
  keyword?: string;     
  prompt?: string;      
}

interface QuestionQueryParams {
  mode?: string;    
  kind?: string;    
  level?: string;   
  tag?: string;     
  id?: number | null;
}

// Define the structure for what we send to the backend
interface SubmitAnswerPayload {
  id: number;          // The question ID from the route path parameter
  answer: string;      // The student's submitted text or selected multiple-choice option
  mode?: string;        // Optional practice mode flag
}

// Define the precise response shape matching your Rails QuestionSubmissionEvaluator service
export interface SubmissionResult {
  score: number;
  fully_correct: boolean;
  correct_answers: string[];
  user_new_rating: number;
  elo_change: number;
  already_solved: boolean;
}

export const questionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getRandomQuestion: builder.query<QuestionData, QuestionQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.id) searchParams.append('id', params.id.toString());
        if (params.mode) searchParams.append('mode', params.mode);
        if (params.kind) searchParams.append('kind', params.kind);
        if (params.level) searchParams.append('level', params.level);
        if (params.tag) searchParams.append('tag', params.tag);

        return {
          url: `/questions/random?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'Puzzle' as const }]
    }),

    // Dynamic Mutation Node for processing question grading packages
    submitAnswer: builder.mutation<SubmissionResult, SubmitAnswerPayload>({
      query: ({ id, answer, mode }) => ({
        url: `/questions/${id}/submit_answer`,
        method: 'POST',
        body: { answer, mode }
      }),
      // This is the trigger: It shreds the 'Puzzle' cache on submit so the 
      // subsequent next click pulls a completely fresh, un-cached puzzle from Rails!
      invalidatesTags: [{ type: 'Puzzle' as const }]
    }),

  }),
});

// Added useSubmitAnswerMutation export to the hooks bundle
export const { 
  useGetRandomQuestionQuery,
  useSubmitAnswerMutation 
} = questionApiSlice;