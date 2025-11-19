// Supabase数据库类型定义
export interface MacVod {
  vod_id: number;
  vod_name: string;
  vod_sub?: string;
  vod_en?: string;
  vod_pic?: string;
  vod_pic_supabase?: string;
  vod_year?: string;
  vod_area?: string;
  vod_lang?: string;
  vod_actor?: string;
  vod_director?: string;
  vod_remarks?: string;
  vod_content?: string;
  vod_score?: number;
  vod_play_from?: string;
  vod_play_url?: string;
  type_id?: number;
  vod_time?: string;
  vod_status?: number;
}

export interface MacType {
  type_id: number;
  type_name: string;
  type_en?: string;
  type_pid?: number;
  type_status?: number;
  type_sort?: number;
}

export interface MacActor {
  actor_id: number;
  actor_name: string;
  actor_en?: string;
  actor_pic_supabase?: string;
  actor_birthday?: string;
}

export interface MacVodActor {
  id: number;
  vod_id: number;
  actor_id: number;
  actor_role?: string;
}

// 播放源数据结构
export interface PlaySource {
  name: string;
  episodes: PlayEpisode[];
}

export interface PlayEpisode {
  name: string;
  url: string;
}

export interface ParsedPlayData {
  sources: PlaySource[];
}
