import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Actor, ActorWithRole } from 'src/types/Actor';
import { Movie } from 'src/types/Movie';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const actorApi = createApi({
  reducerPath: 'actorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SUPABASE_URL}/rest/v1`,
    prepareHeaders: (headers) => {
      headers.set('apikey', SUPABASE_ANON_KEY);
      headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
      headers.set('Prefer', 'return=representation');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 获取视频的演员列表
    getVideoActors: builder.query<ActorWithRole[], number>({
      async queryFn(vodId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // 第一步：获取演员关系
          const relationResult = await fetchWithBQ({
            url: '/mac_vod_actor',
            params: {
              vod_id: `eq.${vodId}`,
              select: 'actor_id,actor_role,actor_order',
              order: 'actor_order.asc',
            },
          });

          if (relationResult.error) {
            console.error('获取演员关系失败:', relationResult.error);
            return { data: [] };
          }

          const relations = relationResult.data as any[];
          console.log('演员关系数据:', relations);

          if (!relations || relations.length === 0) {
            return { data: [] };
          }

          // 第二步：获取演员详情
          const actorIds = relations.map(r => r.actor_id).join(',');
          const actorsResult = await fetchWithBQ({
            url: '/mac_actor',
            params: {
              actor_id: `in.(${actorIds})`,
              select: '*',
            },
          });

          if (actorsResult.error) {
            console.error('获取演员详情失败:', actorsResult.error);
            return { data: [] };
          }

          const actors = actorsResult.data as any[];
          console.log('演员详情数据:', actors);

          // 合并数据
          const result = relations.map(relation => {
            const actor = actors.find(a => a.actor_id === relation.actor_id);
            if (!actor) return null;
            return {
              ...actor,
              role: relation.actor_role,
              order: relation.actor_order,
            };
          }).filter(Boolean) as ActorWithRole[];

          console.log('最终演员数据:', result);
          return { data: result };
        } catch (error) {
          console.error('查询演员数据出错:', error);
          return { data: [] };
        }
      },
    }),

    // 获取演员详情
    getActorDetail: builder.query<Actor, number>({
      query: (actorId) => ({
        url: '/mac_actor',
        params: {
          actor_id: `eq.${actorId}`,
          select: '*',
        },
      }),
      transformResponse: (response: Actor[]) => response[0],
    }),

    // 获取演员参演的作品
    getActorWorks: builder.query<Movie[], number>({
      async queryFn(actorId, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // 第一步：获取视频关系
          const relationResult = await fetchWithBQ({
            url: '/mac_vod_actor',
            params: {
              actor_id: `eq.${actorId}`,
              select: 'vod_id',
              order: 'created_at.desc',
              limit: 50,
            },
          });

          if (relationResult.error) {
            console.error('获取作品关系失败:', relationResult.error);
            return { data: [] };
          }

          const relations = relationResult.data as any[];
          if (!relations || relations.length === 0) {
            return { data: [] };
          }

          // 第二步：获取视频详情
          const vodIds = relations.map(r => r.vod_id).join(',');
          const vodsResult = await fetchWithBQ({
            url: '/mac_vod',
            params: {
              vod_id: `in.(${vodIds})`,
              select: 'vod_id,vod_name,vod_pic,vod_pic_supabase,vod_year,vod_score,type_id',
            },
          });

          if (vodsResult.error) {
            console.error('获取视频详情失败:', vodsResult.error);
            return { data: [] };
          }

          const vods = vodsResult.data as any[];
          const result = vods.map(vod => ({
            id: vod.vod_id,
            title: vod.vod_name,
            poster_path: vod.vod_pic_supabase || vod.vod_pic,
            backdrop_path: vod.vod_pic_supabase || vod.vod_pic,
            release_date: vod.vod_year || '',
            vote_average: vod.vod_score || 0,
            genre_ids: [vod.type_id],
            overview: '',
            adult: false,
            original_title: vod.vod_name,
            original_language: 'zh',
            popularity: 0,
            vote_count: 0,
            video: false,
          }));

          return { data: result };
        } catch (error) {
          console.error('查询演员作品出错:', error);
          return { data: [] };
        }
      },
    }),
  }),
});

export const {
  useGetVideoActorsQuery,
  useGetActorDetailQuery,
  useGetActorWorksQuery,
} = actorApi;
