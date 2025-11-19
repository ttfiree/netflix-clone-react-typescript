import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getTypes } from 'src/lib/supabaseApi';
import { Genre } from 'src/types/Genre';

export const supabaseGenreApi = createApi({
  reducerPath: 'supabaseGenreApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getGenres: builder.query<Genre[], string>({
      async queryFn() {
        try {
          const types = await getTypes();
          // 只返回一级分类（type_pid = 0）
          const primaryTypes = types.filter(type => type.type_pid === 0);
          // 转换为Genre格式
          const genres: Genre[] = primaryTypes.map(type => ({
            id: type.type_id,
            name: type.type_name,
            type_en: type.type_en, // 添加英文名
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
