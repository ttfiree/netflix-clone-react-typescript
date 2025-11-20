/**
 * 演员类型定义
 */

export interface Actor {
  actor_id: number;
  actor_name: string;
  actor_en: string;
  actor_pic: string;
  actor_pic_supabase: string;
  actor_blurb: string;
  actor_remarks: string;
  actor_area: string;
  actor_birthday: string;
  actor_birtharea: string;
  actor_height: string;
  actor_weight: string;
  actor_blood: string;
  actor_starsign: string;
  actor_works: string;
  actor_tag: string;
  actor_class: string;
  actor_level: number;
  actor_time: string;
  actor_time_add: string;
  actor_hits: number;
  actor_hits_day: number;
  actor_hits_week: number;
  actor_hits_month: number;
  actor_score: number;
  actor_score_all: number;
  actor_score_num: number;
  actor_up: number;
  actor_down: number;
  actor_content: string;
  actor_status: number;
  
  // TMDb 数据
  tmdb_id: number;
  tmdb_popularity: number;
  tmdb_profile_path: string;
  tmdb_known_for_department: string;
  tmdb_gender: number;
  tmdb_biography: string;
  tmdb_place_of_birth: string;
  tmdb_also_known_as: string;
  
  created_at: string;
  updated_at: string;
}

export interface VodActor {
  id: number;
  vod_id: number;
  actor_id: number;
  actor_role: 'actor' | 'director' | 'writer';
  actor_order: number;
  created_at: string;
  
  // 关联的演员信息
  actor?: Actor;
}

export interface ActorWithRole extends Actor {
  role: string;
  order: number;
}
