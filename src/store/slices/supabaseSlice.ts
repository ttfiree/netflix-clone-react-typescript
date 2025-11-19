import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MEDIA_TYPE, PaginatedMovieResult } from 'src/types/Common';
import { MovieDetail } from 'src/types/Movie';
import {
  getVideos,
  getVideosByType,
  getVideoDetail,
  searchVideos,
  getSimilarVideos,
} from 'src/lib/supabaseApi';

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 300, // 缓存5分钟
  refetchOnMountOrArgChange: 300, // 5分钟内不重新请求
  endpoints: (builder) => ({
    // 获取视频列表（替代popular, top_rated等）
    getVideosByCustomGenre: builder.query<
      PaginatedMovieResult & {
        mediaType: MEDIA_TYPE;
        itemKey: number | string;
      },
      { mediaType: MEDIA_TYPE; apiString: string; page: number }
    >({
      async queryFn({ page }) {
        try {
          const data = await getVideos(page, 20);
          return {
            data: {
              ...data,
              mediaType: MEDIA_TYPE.Movie,
              itemKey: 'all',
            },
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    // 根据分类ID获取视频
    getVideosByGenreId: builder.query<
      PaginatedMovieResult & {
        mediaType: MEDIA_TYPE;
        itemKey: number | string;
      },
      { mediaType: MEDIA_TYPE; genreId: number; page: number }
    >({
      async queryFn({ genreId, page }) {
        try {
          const data = await getVideosByType(genreId, page, 20);
          return {
            data: {
              ...data,
              mediaType: MEDIA_TYPE.Movie,
              itemKey: genreId,
            },
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    // 获取视频详情
    getVideoDetail: builder.query<
      MovieDetail,
      { mediaType: MEDIA_TYPE; id: number }
    >({
      async queryFn({ id }) {
        try {
          const data = await getVideoDetail(id);
          if (!data) {
            return { error: { status: 404, error: 'Video not found' } };
          }
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    // 获取相似视频
    getSimilarVideos: builder.query<
      PaginatedMovieResult,
      { mediaType: MEDIA_TYPE; id: number }
    >({
      async queryFn({ id }) {
        try {
          const data = await getSimilarVideos(id, 12);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    // 搜索视频
    searchVideos: builder.query<
      PaginatedMovieResult,
      { keyword: string; page: number }
    >({
      async queryFn({ keyword, page }) {
        try {
          const data = await searchVideos(keyword, page, 20);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),

    // 根据分类ID获取视频（用于分类页面）
    getVideosByType: builder.query<
      PaginatedMovieResult,
      { typeId: number; page: number; limit?: number }
    >({
      async queryFn({ typeId, page, limit = 20 }) {
        try {
          const data = await getVideosByType(typeId, page, limit);
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
  }),
});

export const {
  useGetVideosByCustomGenreQuery,
  useLazyGetVideosByCustomGenreQuery,
  useGetVideosByGenreIdQuery,
  useLazyGetVideosByGenreIdQuery,
  useGetVideoDetailQuery,
  useLazyGetVideoDetailQuery,
  useGetSimilarVideosQuery,
  useLazyGetSimilarVideosQuery,
  useSearchVideosQuery,
  useLazySearchVideosQuery,
  useGetVideosByTypeQuery,
  useLazyGetVideosByTypeQuery,
} = supabaseApi;
