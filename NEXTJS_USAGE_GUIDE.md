# Next.js 视频网站开发指南

## 数据库使用说明

本文档说明如何使用采集系统的数据库数据，在Next.js中构建视频播放网站。

---

## 目录

1. [数据库结构](#数据库结构)
2. [Next.js项目设置](#nextjs项目设置)
3. [数据库连接](#数据库连接)
4. [核心功能实现](#核心功能实现)
5. [页面示例](#页面示例)
6. [API路由](#api路由)
7. [播放器集成](#播放器集成)

---

## 数据库结构

### 核心表

#### 1. mac_vod (视频表)

```sql
-- 关键字段说明
vod_id              -- 视频ID（主键）
vod_name            -- 视频名称
vod_pic             -- 封面图片
vod_pic_supabase    -- Supabase图片（优先使用）
vod_year            -- 年份
vod_area            -- 地区
vod_lang            -- 语言
vod_actor           -- 演员
vod_director        -- 导演
vod_remarks         -- 更新状态（如：第10集）
vod_content         -- 简介
vod_score           -- 评分
vod_play_from       -- 播放源（如：jsyun$$$jsm3u8）
vod_play_url        -- 播放地址（格式：第1集$url#第2集$url）
type_id             -- 分类ID
vod_time            -- 更新时间
```

#### 2. mac_type (分类表)

```sql
type_id             -- 分类ID
type_name           -- 分类名称
type_pid            -- 父分类ID（0为一级分类）
```

#### 3. mac_actor (演员表)

```sql
actor_id            -- 演员ID
actor_name          -- 演员名称
actor_en            -- 英文名
actor_pic_supabase  -- 头像
actor_birthday      -- 生日
```

#### 4. mac_vod_actor (演员-视频关系表)

```sql
vod_id              -- 视频ID
actor_id            -- 演员ID
actor_role          -- 角色（actor/director）
```

---

## Next.js项目设置

### 1. 创建项目

```bash
npx create-next-app@latest my-video-site
cd my-video-site
```

选择配置：
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes

### 2. 安装依赖

```bash
# 数据库客户端
npm install @vercel/postgres
# 或使用 Prisma
npm install @prisma/client
npm install -D prisma

# 其他依赖
npm install swr                    # 数据获取
npm install react-player           # 视频播放器
npm install dplayer                # 或使用DPlayer
npm install date-fns               # 日期处理
```

---

## 数据库连接

### 方式1：使用 @vercel/postgres

#### 配置环境变量 (.env.local)

```bash
POSTGRES_URL="postgresql://postgres:password@host:5432/database"
POSTGRES_PRISMA_URL="postgresql://postgres:password@host:5432/database?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://postgres:password@host:5432/database"
```

#### 数据库工具类 (lib/db.ts)

```typescript
import { sql } from '@vercel/postgres';

export async function getVideos(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const { rows } = await sql`
    SELECT 
      vod_id,
      vod_name,
      COALESCE(vod_pic_supabase, vod_pic) as vod_pic,
      vod_year,
      vod_area,
      vod_remarks,
      vod_score,
      type_id
    FROM mac_vod
    WHERE vod_status = 1
    ORDER BY vod_time DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return rows;
}

export async function getVideoDetail(vodId: number) {
  const { rows } = await sql`
    SELECT 
      vod_id,
      vod_name,
      vod_sub,
      vod_en,
      COALESCE(vod_pic_supabase, vod_pic) as vod_pic,
      vod_year,
      vod_area,
      vod_lang,
      vod_actor,
      vod_director,
      vod_remarks,
      vod_content,
      vod_score,
      vod_play_from,
      vod_play_url,
      type_id
    FROM mac_vod
    WHERE vod_id = ${vodId}
  `;
  
  return rows[0];
}

export async function getVideosByType(typeId: number, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const { rows } = await sql`
    SELECT 
      vod_id,
      vod_name,
      COALESCE(vod_pic_supabase, vod_pic) as vod_pic,
      vod_year,
      vod_remarks,
      vod_score
    FROM mac_vod
    WHERE type_id = ${typeId} AND vod_status = 1
    ORDER BY vod_time DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return rows;
}

export async function searchVideos(keyword: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const { rows } = await sql`
    SELECT 
      vod_id,
      vod_name,
      COALESCE(vod_pic_supabase, vod_pic) as vod_pic,
      vod_year,
      vod_remarks
    FROM mac_vod
    WHERE vod_name ILIKE ${'%' + keyword + '%'}
      AND vod_status = 1
    ORDER BY vod_time DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return rows;
}

export async function getTypes() {
  const { rows } = await sql`
    SELECT type_id, type_name, type_pid
    FROM mac_type
    WHERE type_status = 1
    ORDER BY type_sort
  `;
  
  return rows;
}
```

### 方式2：使用 Prisma

#### 初始化 Prisma

```bash
npx prisma init
```

#### Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Vod {
  vodId            Int       @id @map("vod_id")
  vodName          String    @map("vod_name")
  vodPic           String?   @map("vod_pic")
  vodPicSupabase   String?   @map("vod_pic_supabase")
  vodYear          String?   @map("vod_year")
  vodArea          String?   @map("vod_area")
  vodLang          String?   @map("vod_lang")
  vodActor         String?   @map("vod_actor")
  vodDirector      String?   @map("vod_director")
  vodRemarks       String?   @map("vod_remarks")
  vodContent       String?   @map("vod_content")
  vodScore         Float?    @map("vod_score")
  vodPlayFrom      String?   @map("vod_play_from")
  vodPlayUrl       String?   @map("vod_play_url")
  typeId           Int?      @map("type_id")
  vodTime          DateTime? @map("vod_time")
  vodStatus        Int?      @map("vod_status")
  
  type             Type?     @relation(fields: [typeId], references: [typeId])
  actors           VodActor[]
  
  @@map("mac_vod")
}

model Type {
  typeId     Int     @id @map("type_id")
  typeName   String  @map("type_name")
  typeEn     String? @map("type_en")
  typePid    Int?    @map("type_pid")
  typeStatus Int?    @map("type_status")
  
  vods       Vod[]
  
  @@map("mac_type")
}

model Actor {
  actorId          Int       @id @map("actor_id")
  actorName        String    @map("actor_name")
  actorEn          String?   @map("actor_en")
  actorPicSupabase String?   @map("actor_pic_supabase")
  actorBirthday    String?   @map("actor_birthday")
  
  vodActors        VodActor[]
  
  @@map("mac_actor")
}

model VodActor {
  id         Int     @id @default(autoincrement())
  vodId      Int     @map("vod_id")
  actorId    Int     @map("actor_id")
  actorRole  String? @map("actor_role")
  
  vod        Vod     @relation(fields: [vodId], references: [vodId])
  actor      Actor   @relation(fields: [actorId], references: [actorId])
  
  @@map("mac_vod_actor")
}
```

#### 生成 Prisma Client

```bash
npx prisma generate
```

#### Prisma 工具类 (lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 核心功能实现

### 1. 首页 - 最新视频列表

#### app/page.tsx

```typescript
import { getVideos, getTypes } from '@/lib/db';
import VideoCard from '@/components/VideoCard';
import TypeNav from '@/components/TypeNav';

export default async function HomePage() {
  const videos = await getVideos(1, 24);
  const types = await getTypes();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TypeNav types={types} />
      
      <h1 className="text-3xl font-bold mb-6">最新更新</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.vod_id} video={video} />
        ))}
      </div>
    </div>
  );
}
```

### 2. 视频详情页

#### app/video/[id]/page.tsx

```typescript
import { getVideoDetail } from '@/lib/db';
import VideoPlayer from '@/components/VideoPlayer';
import { parsePlayUrl } from '@/lib/utils';

export default async function VideoDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const video = await getVideoDetail(parseInt(params.id));
  
  if (!video) {
    return <div>视频不存在</div>;
  }
  
  // 解析播放地址
  const playData = parsePlayUrl(video.vod_play_from, video.vod_play_url);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 播放器 */}
        <div className="lg:col-span-2">
          <VideoPlayer playData={playData} />
        </div>
        
        {/* 视频信息 */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{video.vod_name}</h1>
          
          <div className="space-y-2 text-sm">
            <p>年份: {video.vod_year}</p>
            <p>地区: {video.vod_area}</p>
            <p>语言: {video.vod_lang}</p>
            <p>导演: {video.vod_director}</p>
            <p>主演: {video.vod_actor}</p>
            <p>更新: {video.vod_remarks}</p>
            <p>评分: {video.vod_score}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">简介</h3>
            <p className="text-sm text-gray-600">{video.vod_content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. 分类页面

#### app/type/[id]/page.tsx

```typescript
import { getVideosByType } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export default async function TypePage({ 
  params,
  searchParams 
}: { 
  params: { id: string };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const videos = await getVideosByType(parseInt(params.id), page, 24);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.vod_id} video={video} />
        ))}
      </div>
      
      {/* 分页组件 */}
      <Pagination currentPage={page} />
    </div>
  );
}
```

### 4. 搜索功能

#### app/search/page.tsx

```typescript
import { searchVideos } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; page?: string };
}) {
  const keyword = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  
  if (!keyword) {
    return <div>请输入搜索关键词</div>;
  }
  
  const videos = await searchVideos(keyword, page, 24);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        搜索结果: {keyword}
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.vod_id} video={video} />
        ))}
      </div>
    </div>
  );
}
```

---

## 组件示例

### 1. 视频卡片组件

#### components/VideoCard.tsx

```typescript
import Image from 'next/image';
import Link from 'next/link';

interface VideoCardProps {
  video: {
    vod_id: number;
    vod_name: string;
    vod_pic: string;
    vod_remarks?: string;
    vod_score?: number;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.vod_id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={video.vod_pic || '/placeholder.jpg'}
            alt={video.vod_name}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
          
          {video.vod_remarks && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {video.vod_remarks}
            </div>
          )}
          
          {video.vod_score && video.vod_score > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.vod_score.toFixed(1)}
            </div>
          )}
        </div>
        
        <h3 className="mt-2 text-sm font-medium line-clamp-2">
          {video.vod_name}
        </h3>
      </div>
    </Link>
  );
}
```

### 2. 播放器组件

#### components/VideoPlayer.tsx

```typescript
'use client';

import { useState } from 'react';
import ReactPlayer from 'react-player';

interface PlayData {
  sources: {
    name: string;
    episodes: {
      name: string;
      url: string;
    }[];
  }[];
}

export default function VideoPlayer({ playData }: { playData: PlayData }) {
  const [currentSource, setCurrentSource] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  
  const source = playData.sources[currentSource];
  const episode = source?.episodes[currentEpisode];
  
  if (!episode) {
    return <div>暂无播放源</div>;
  }
  
  return (
    <div>
      {/* 播放器 */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={episode.url}
          width="100%"
          height="100%"
          controls
          playing
        />
      </div>
      
      {/* 播放源切换 */}
      <div className="mt-4">
        <div className="flex gap-2 mb-2">
          {playData.sources.map((src, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSource(idx);
                setCurrentEpisode(0);
              }}
              className={`px-4 py-2 rounded ${
                idx === currentSource
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {src.name}
            </button>
          ))}
        </div>
        
        {/* 集数选择 */}
        <div className="grid grid-cols-8 gap-2">
          {source.episodes.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentEpisode(idx)}
              className={`px-3 py-2 rounded text-sm ${
                idx === currentEpisode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {ep.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 3. 工具函数

#### lib/utils.ts

```typescript
/**
 * 解析播放地址
 * vod_play_from: "jsyun$$$jsm3u8"
 * vod_play_url: "第1集$url1#第2集$url2$$$第1集$url1#第2集$url2"
 */
export function parsePlayUrl(playFrom: string, playUrl: string) {
  const sources = playFrom.split('$$$');
  const urls = playUrl.split('$$$');
  
  return {
    sources: sources.map((name, idx) => ({
      name,
      episodes: urls[idx]?.split('#').map(ep => {
        const [epName, epUrl] = ep.split('$');
        return { name: epName, url: epUrl };
      }) || []
    }))
  };
}

/**
 * 获取图片URL（优先使用Supabase）
 */
export function getImageUrl(supabaseUrl?: string, originalUrl?: string) {
  return supabaseUrl || originalUrl || '/placeholder.jpg';
}
```

---

## API路由示例

### app/api/videos/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getVideos } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    const videos = await getVideos(page, limit);
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
```

---

## 播放地址格式说明

### 格式解析

```
vod_play_from: "jsyun$$$jsm3u8$$$bfzym3u8"
vod_play_url: "第1集$https://xxx.com/1.m3u8#第2集$https://xxx.com/2.m3u8$$$第1集$https://yyy.com/1.m3u8#第2集$https://yyy.com/2.m3u8$$$第1集$https://zzz.com/1.m3u8"
```

**解析规则**：
1. `$$$` 分隔不同播放源
2. `#` 分隔同一播放源的不同集数
3. `$` 分隔集数名称和播放URL

**解析结果**：
```javascript
{
  sources: [
    {
      name: "jsyun",
      episodes: [
        { name: "第1集", url: "https://xxx.com/1.m3u8" },
        { name: "第2集", url: "https://xxx.com/2.m3u8" }
      ]
    },
    {
      name: "jsm3u8",
      episodes: [
        { name: "第1集", url: "https://yyy.com/1.m3u8" },
        { name: "第2集", url: "https://yyy.com/2.m3u8" }
      ]
    }
  ]
}
```

---

## 性能优化建议

### 1. 图片优化

```typescript
// next.config.js
module.exports = {
  images: {
    domains: [
      'img.jisuimage.com',
      'your-supabase-project.supabase.co'
    ],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 2. 数据缓存

```typescript
// 使用 Next.js 缓存
export const revalidate = 3600; // 1小时

// 或使用 SWR
import useSWR from 'swr';

function useVideos(page: number) {
  const { data, error } = useSWR(
    `/api/videos?page=${page}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return { videos: data, isLoading: !error && !data, error };
}
```

### 3. 分页优化

```typescript
// 使用游标分页
export async function getVideosCursor(cursor?: number, limit = 20) {
  const { rows } = await sql`
    SELECT * FROM mac_vod
    WHERE vod_id < ${cursor || 999999}
    ORDER BY vod_id DESC
    LIMIT ${limit}
  `;
  
  return rows;
}
```

---

## 部署

### Vercel部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 配置环境变量
vercel env add POSTGRES_URL
```

### 环境变量

```bash
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

---

## 总结

使用采集系统的数据库，你可以快速构建：

✅ 视频列表页
✅ 视频详情页
✅ 分类浏览
✅ 搜索功能
✅ 演员页面
✅ 在线播放

**关键点**：
1. 优先使用 `vod_pic_supabase`（如果有）
2. 正确解析 `vod_play_url` 格式
3. 使用 Next.js 的缓存和优化功能
4. 图片使用 Next.js Image 组件

完整示例代码可以参考本文档的各个部分！
