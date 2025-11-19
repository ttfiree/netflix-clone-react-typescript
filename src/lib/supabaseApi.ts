import { supabase } from './supabase';
import { MacVod, MacType, ParsedPlayData } from 'src/types/Supabase';
import { Movie, MovieDetail } from 'src/types/Movie';
import { PaginatedMovieResult } from 'src/types/Common';

/**
 * 解析播放地址
 * 支持多种分隔符格式：
 * vod_play_from: "jsyun$$$jsm3u8" 或 "jsyun$$jsm3u8"
 * vod_play_url: "第1集$url1#第2集$url2$$$第1集$url1#第2集$url2" 或 "第1集$url1#第2集$url2$$第1集$url1#第2集$url2"
 */
export function parsePlayUrl(playFrom?: string, playUrl?: string): ParsedPlayData {
  if (!playFrom || !playUrl) {
    return { sources: [] };
  }

  // 自动检测分隔符（$$$ 或 $$）
  const sourceSeparator = playFrom.includes('$$$') ? '$$$' : '$$';
  const urlSeparator = playUrl.includes('$$$') ? '$$$' : '$$';

  const sources = playFrom.split(sourceSeparator);
  const urls = playUrl.split(urlSeparator);

  return {
    sources: sources.map((name, idx) => ({
      name: name.trim(),
      episodes: urls[idx]?.split('#').map(ep => {
        const [epName, epUrl] = ep.split('$');
        return { name: epName?.trim() || '', url: epUrl?.trim() || '' };
      }).filter(ep => ep.url) || []
    })).filter(source => source.episodes.length > 0)
  };
}

/**
 * 将Supabase的MacVod转换为Movie类型
 */
export function convertMacVodToMovie(vod: MacVod): Movie {
  return {
    id: vod.vod_id,
    title: vod.vod_name,
    original_title: vod.vod_en || vod.vod_name,
    overview: vod.vod_content || '',
    poster_path: vod.vod_pic_supabase || vod.vod_pic || null,
    backdrop_path: vod.vod_pic_supabase || vod.vod_pic || null,
    release_date: vod.vod_year || '',
    genre_ids: vod.type_id ? [vod.type_id] : [],
    vote_average: vod.vod_score || 0,
    vote_count: 0,
    popularity: 0,
    adult: false,
    video: false,
    original_language: vod.vod_lang || 'zh',
  };
}

/**
 * 将Supabase的MacVod转换为MovieDetail类型
 * 保留原始的播放数据字段
 */
export function convertMacVodToMovieDetail(vod: MacVod): MovieDetail & { vod_play_from?: string; vod_play_url?: string } {
  const playData = parsePlayUrl(vod.vod_play_from, vod.vod_play_url);
  
  // 尝试从播放URL中提取YouTube视频ID（如果有）
  const youtubeKey = playData.sources[0]?.episodes[0]?.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || '';

  return {
    id: vod.vod_id,
    title: vod.vod_name,
    original_title: vod.vod_en || vod.vod_name,
    overview: vod.vod_content || '',
    poster_path: vod.vod_pic_supabase || vod.vod_pic || null,
    backdrop_path: vod.vod_pic_supabase || vod.vod_pic || null,
    release_date: vod.vod_year || '',
    vote_average: vod.vod_score || 0,
    vote_count: 0,
    popularity: 0,
    adult: false,
    video: false,
    original_language: vod.vod_lang || 'zh',
    genres: vod.type_id ? [{ id: vod.type_id, name: '' }] : [],
    runtime: 0,
    status: vod.vod_remarks || '',
    tagline: vod.vod_sub || '',
    budget: 0,
    revenue: 0,
    homepage: '',
    imdb_id: '',
    belongs_to_collection: null,
    production_companies: [],
    production_countries: vod.vod_area ? [{ iso_3166_1: '', english_name: vod.vod_area }] : [],
    spoken_languages: vod.vod_lang ? [{ iso_639_1: '', english_name: vod.vod_lang, name: vod.vod_lang }] : [],
    videos: {
      results: youtubeKey ? [{
        id: youtubeKey,
        iso_639_1: 'zh',
        iso_3166_1: 'CN',
        key: youtubeKey,
        name: vod.vod_name,
        official: false,
        published_at: '',
        site: 'YouTube',
        size: 1080,
        type: 'Trailer',
      }] : []
    },
    // 保留原始播放数据
    vod_play_from: vod.vod_play_from,
    vod_play_url: vod.vod_play_url,
  };
}

/**
 * 获取视频列表
 */
export async function getVideos(page = 1, limit = 20): Promise<PaginatedMovieResult> {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('mac_vod')
    .select('*', { count: 'exact' })
    .eq('vod_status', 1)
    .order('vod_time', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching videos:', error);
    return { page, results: [], total_pages: 0, total_results: 0 };
  }

  const totalResults = count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    page,
    results: (data || []).map(convertMacVodToMovie),
    total_pages: totalPages,
    total_results: totalResults,
  };
}

/**
 * 根据分类获取视频
 * 如果是父分类，会查询所有子分类的视频
 */
export async function getVideosByType(typeId: number, page = 1, limit = 20): Promise<PaginatedMovieResult> {
  const offset = (page - 1) * limit;

  console.log('=== getVideosByType ===');
  console.log('typeId:', typeId);
  console.log('page:', page);
  console.log('offset:', offset);
  console.log('limit:', limit);

  // 先检查是否是父分类
  const { data: typeData } = await supabase
    .from('mac_type')
    .select('type_id, type_pid')
    .eq('type_id', typeId)
    .single();

  let typeIds = [typeId];
  
  // 如果是父分类（type_pid = 0），获取所有子分类ID
  if (typeData && typeData.type_pid === 0) {
    const { data: subTypes } = await supabase
      .from('mac_type')
      .select('type_id')
      .eq('type_pid', typeId);
    
    if (subTypes && subTypes.length > 0) {
      typeIds = [typeId, ...subTypes.map(t => t.type_id)];
      console.log('父分类，包含子分类:', typeIds);
    }
  }

  // 查询视频
  const { data, error, count } = await supabase
    .from('mac_vod')
    .select('*', { count: 'exact' })
    .in('type_id', typeIds)
    .eq('vod_status', 1)
    .order('vod_time', { ascending: false })
    .range(offset, offset + limit - 1);

  console.log('查询结果:', { 
    typeIds,
    dataCount: data?.length, 
    totalCount: count, 
    error: error?.message 
  });

  if (error) {
    console.error('Error fetching videos by type:', error);
    return { page, results: [], total_pages: 0, total_results: 0 };
  }

  const totalResults = count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    page,
    results: (data || []).map(convertMacVodToMovie),
    total_pages: totalPages,
    total_results: totalResults,
  };
}

/**
 * 获取视频详情
 */
export async function getVideoDetail(vodId: number): Promise<MovieDetail | null> {
  const { data, error } = await supabase
    .from('mac_vod')
    .select('*')
    .eq('vod_id', vodId)
    .single();

  if (error) {
    console.error('Error fetching video detail:', error);
    return null;
  }

  return data ? convertMacVodToMovieDetail(data) : null;
}

/**
 * 搜索视频
 */
export async function searchVideos(keyword: string, page = 1, limit = 20): Promise<PaginatedMovieResult> {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('mac_vod')
    .select('*', { count: 'exact' })
    .ilike('vod_name', `%${keyword}%`)
    .eq('vod_status', 1)
    .order('vod_time', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error searching videos:', error);
    return { page, results: [], total_pages: 0, total_results: 0 };
  }

  const totalResults = count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    page,
    results: (data || []).map(convertMacVodToMovie),
    total_pages: totalPages,
    total_results: totalResults,
  };
}

/**
 * 获取分类列表
 */
export async function getTypes(): Promise<MacType[]> {
  const { data, error } = await supabase
    .from('mac_type')
    .select('*')
    .eq('type_status', 1)
    .order('type_sort', { ascending: true });

  if (error) {
    console.error('Error fetching types:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取相似视频（基于同类型）
 */
export async function getSimilarVideos(vodId: number, limit = 12): Promise<PaginatedMovieResult> {
  // 先获取当前视频的类型
  const { data: currentVod } = await supabase
    .from('mac_vod')
    .select('type_id')
    .eq('vod_id', vodId)
    .single();

  if (!currentVod?.type_id) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  // 获取同类型的其他视频
  const { data, error } = await supabase
    .from('mac_vod')
    .select('*')
    .eq('type_id', currentVod.type_id)
    .neq('vod_id', vodId)
    .eq('vod_status', 1)
    .order('vod_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching similar videos:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  return {
    page: 1,
    results: (data || []).map(convertMacVodToMovie),
    total_pages: 1,
    total_results: data?.length || 0,
  };
}


/**
 * 批量获取多个分类的视频（优化版）
 * 一次性获取所有分类的前N个视频
 */
export async function getVideosForAllTypes(limit = 10): Promise<Record<number, PaginatedMovieResult>> {
  // 先获取所有分类
  const types = await getTypes();
  
  const result: Record<number, PaginatedMovieResult> = {};
  
  // 并行获取所有分类的视频
  await Promise.all(
    types.map(async (type) => {
      const { data, error } = await supabase
        .from('mac_vod')
        .select('*')
        .eq('type_id', type.type_id)
        .eq('vod_status', 1)
        .order('vod_time', { ascending: false })
        .limit(limit);

      if (!error && data) {
        result[type.type_id] = {
          page: 1,
          results: data.map(convertMacVodToMovie),
          total_pages: 1,
          total_results: data.length,
        };
      }
    })
  );
  
  return result;
}
