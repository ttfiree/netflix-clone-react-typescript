import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getTypes } from 'src/lib/supabaseApi';
import { Genre } from 'src/types/Genre';

export const supabaseGenreApi = createApi({
  reducerPath: 'supabaseGenreApi',
  baseQuery: fakeBaseQuery(),
  // 设置长时间缓存
  keepUnusedDataFor: 24 * 60 * 60, // 1小时缓存
  refetchOnMountOrArgChange: 24 * 60 * 60, // 1小时内不重新请求
  refetchOnReconnect: false, // 重新连接时不刷新
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], void>({
      async queryFn() {
        try {
          // 从数据库获取（RTK Query 会自动缓存）
          const types = await getTypes();
          // 只返回一级分类（type_pid = 0）
          const primaryTypes = types.filter(type => type.type_pid === 0);
          // 转换为Genre格式
          const genres: Genre[] = primaryTypes.map(type => ({
            id: type.type_id,
            name: type.type_name,
            type_en: type.type_en,
          } as any));
          
          return { data: genres };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
    }),
  }),
});

export const { 
  useGetGenresQuery,
  endpoints: supabaseGenreSliceEndpoints 
} = supabaseGenreApi;
