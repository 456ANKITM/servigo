import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include', // cookies will be sent automatically
  }),
  tagTypes:["Notifications", "Unread", "Conversation", "Message"],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => "/api/user/get-user", 
      providesTags:["User"]
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url:"/api/user/update-profile",
        method:'PUT',
        body:data
      }),
      invalidatesTags:["User"]
    }),
    getAllJobs: builder.query({
      query:() => ({
        url: "/api/job"
      }),
      provideTags:["Jobs"]
    }),
    addJob: builder.mutation({
      query: (data) => ({
        url:"/api/job",
        method:'POST',
        body:data
      }),
      invalidatesTags:["Jobs"]
    }),
    getJobsByClient: builder.query({
      query:() => ({
        url:"/api/job/getJobsByClient"
      }),
      providesTags:["Jobs"]
    }),
    updateJobStatus: builder.mutation({
      query:({jobId, status}) => ({
        url:`/api/job/updateJobStatus/${jobId}`,
        method:'POST',
        body:{status},
      }),
      invalidatesTags:["Jobs"]
    }),
    deleteJob:builder.mutation({
      query:(jobId) => ({
        url:`/api/job/deleteJob/${jobId}`,
        method:'DELETE'
      }),
      invalidatesTags:["Jobs"]
    }),
    getJobById: builder.query({
      query:(jobId) => ({
        url:`/api/job/${jobId}`
      })
    }),
    searchJobs: builder.query({
      query: ({search=""}) => ({
        url:`/api/job/searchJobs?search=${search}`
      })
    }),
    searchUsers: builder.query({
      query:({query="", city=""}) => ({
        url:`/api/user/searchUser?query=${query}&city=${city}`
      })
    }),
    submitProposal: builder.mutation({
      query: ({jobId, formData}) => ({
        url: `/api/job/submitProposal/${jobId}`,
         method:'POST',
        body: formData
      }),
    }),
    getRankedProposals: builder.query({
      query:(jobId) => ({
        url:`/api/job/getProposals/${jobId}`
      }),
    }),
    easyApplyJob: builder.mutation({
      query:(jobId) => ({
        url:`/api/job/apply/${jobId}`,
        method:'POST'
      }),
    }),
    getAppliedWorkerRanked: builder.query({
      query:(jobId) => ({
        url:`/api/job/applied-workers/${jobId}`
      }),
    }),
    getUserById: builder.query({
      query:(userId) => ({
        url:`/api/user/${userId}`,
        method: "GET"
      }),
    }),
    rateUser:builder.mutation({
      query:({userId, rating}) => ({
        url:`/api/user/rate/${userId}`,
        method:'POST',
        body:{rating}
      }),
    }),
    addReview: builder.mutation({
      query:({userId, comment}) => ({
        url:`/api/user/review/${userId}`,
        method:'POST',
        body:{comment}
      }),
       invalidatesTags: ["UserReviews"],
    }),
    getUserReviews: builder.query({
      query: (userId) => ({
        url:`/api/user/reviews/${userId}`
      }),
       providesTags: ["UserReviews"],
    }),
    hireWorker: builder.mutation({
      query:({jobId, userId}) => ({
        url:`/api/job/${jobId}/hire/${userId}`,
        method:"POST"
      }),
      invalidatesTags:["Jobs"]
    }),
    getUserNotifications: builder.query({
      query: () => ({
        url:"/api/notification",
        method:'GET'
      }),
      providesTags: ["Notifications"],
    }),
    getUnreadCount: builder.query({
      query:() => ({
        url:"/api/notification/unread-count",
        method:"GET"
      }),
      providesTags: ["Unread"]
    }),
    markAsRead: builder.mutation({
      query:() => ({
        url:`/api/notification/mark-read-all`,
        method:'PATCH'
      }),
      invalidatesTags:["Notifications", "Unread"]
    }),
    deleteAllNotifications: builder.mutation({
      query:() => ({
        url:"/api/notification/delete-all",
        method:"DELETE"
      }),
      invalidatesTags: ["Notification"],
    }),
    getConversations: builder.query({
      query: (userId) => ({
        url:`/api/conversation/${userId}`,
      }),
      providesTags:["Conversation"]
    }),
    createConversation: builder.mutation({
      query:(data) => ({
        url:"/api/conversation",
        method:'POST',
        body:data,
      }),
      invalidatesTags:["Conversation"]
    }),

    getMessages: builder.query({
      query:(conversationId) => ({
        url:`/api/message/${conversationId}`
      }),
      providesTags:["Message"]
    }),

    uploadFile: builder.mutation({
      query: (formData) => ({
        url:"/api/message/upload",
        method:"POST",
        body:formData
      })
    }),

    sendMessage: builder.mutation({
      query:(data) => ({
        url:"/api/message",
        method:'POST',
        body:data
      }),
      invalidatesTags:["Message", "Conversation"]
    }),



    markMessageAsRead: builder.mutation({
      query:(conversationId) => ({
        url: `/api/message/${conversationId}/read`,
        method:'PATCH'
      }),
    }),
    getUnreadMessageCount: builder.query({
      query: () => ({
        url: "/api/message/unread-count"
      })
    }),
    saveJob: builder.mutation({
      query:(jobId) => ({
        url:`/api/user/save/${jobId}`,
        method:'POST'
      }),
    }),

    getSavedJobs: builder.query({
      query: () => ({
        url:"/api/user/savedJobs"
      }),
    }),

    getAppliedJobs: builder.query({
      query:() => ({
        url: "/api/user/appliedJobs"
      }),
      providesTags: ["AppliedJobs"],
    }),

    getCurrentJobs: builder.query({
      query: () => ({
        url:"/api/user/current-jobs"
      }),
        providesTags: ["CurrentJobs"],
    }),

    getCompletedJobs: builder.query({
      query:() => ({
        url:"/api/user/completed-jobs"
      }),
       providesTags: ["CompletedJobs"],
    }),

    logout: builder.mutation({
      query:() => ({
        url:"/api/auth/logout",
        method:"POST"
      })
    }),
    updateLocation: builder.mutation({
      query: ({latitude, longitude}) => ({
        url:"/api/user/update-location",
        method:"PUT",
        body:{latitude, longitude}
      })
    }),
    markJobCompleted: builder.mutation({
      query: (jobId) => ({
        url:`/api/job/mark-completed/${jobId}`,
        method:'PATCH'
      }),
    }),
    getWorkerByService: builder.query({
      query: ({service}) => ({
        url:`/api/user/services?service=${service}`,
      })
    }),

    browseJobs:  builder.query({
      query:() => ({
         url:"/api/job/browse-jobs",
         method:"GET"
      }),
      providesTags:["Jobs"]
    }),

    getUserAgreements: builder.query({
      query:() => ({
        url:"/api/user/get-user-agreements",
        method:"GET"
      }),
      providesTags:["Agreements"]
    }),

  }),
});

export const { useSignupMutation, useLoginMutation, useGetUserQuery, useUpdateUserMutation, useGetAllJobsQuery, useAddJobMutation, useGetJobsByClientQuery, useUpdateJobStatusMutation, useDeleteJobMutation, useGetJobByIdQuery, useSearchJobsQuery, useSearchUsersQuery, useSubmitProposalMutation, useGetRankedProposalsQuery, useEasyApplyJobMutation, useGetAppliedWorkerRankedQuery, useGetUserByIdQuery, useRateUserMutation, useAddReviewMutation, useGetUserReviewsQuery, useHireWorkerMutation, useGetUserNotificationsQuery, useGetUnreadCountQuery, useMarkAsReadMutation, useDeleteAllNotificationsMutation, useGetConversationsQuery, useCreateConversationMutation, useGetMessagesQuery, useSendMessageMutation, useMarkMessageAsReadMutation, useGetUnreadMessageCountQuery, useSaveJobMutation, useGetSavedJobsQuery, useGetAppliedJobsQuery, useGetCurrentJobsQuery, useGetCompletedJobsQuery, useLogoutMutation, useUpdateLocationMutation, useMarkJobCompletedMutation, useGetWorkerByServiceQuery, useUploadFileMutation, useBrowseJobsQuery, useGetUserAgreementsQuery} = api;