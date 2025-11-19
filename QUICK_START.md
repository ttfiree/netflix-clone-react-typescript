# 🚀 快速开始 - 3步启动项目

## Step 1: 配置环境变量 (2分钟)

```bash
# 复制环境变量文件
cp .env.example .env.local

# 编辑 .env.local，填入你的Supabase凭证
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ 重要**: URL必须是 `https://xxx.supabase.co` 格式，不要使用 `.storage.supabase.co`

**获取凭证**: [Supabase Dashboard](https://app.supabase.com/) → 你的项目 → Settings → API

---

## Step 2: 创建数据库表 (3分钟)

在Supabase SQL Editor中执行：

```sql
-- 视频表
CREATE TABLE mac_vod (
  vod_id SERIAL PRIMARY KEY,
  vod_name VARCHAR(255) NOT NULL,
  vod_pic TEXT,
  vod_pic_supabase TEXT,
  vod_year VARCHAR(10),
  vod_content TEXT,
  vod_score DECIMAL(3,1),
  vod_play_from TEXT,
  vod_play_url TEXT,
  type_id INTEGER,
  vod_status INTEGER DEFAULT 1
);

-- 分类表
CREATE TABLE mac_type (
  type_id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  type_status INTEGER DEFAULT 1
);

-- 插入测试数据
INSERT INTO mac_type (type_name) VALUES ('电影'), ('电视剧');

INSERT INTO mac_vod (vod_name, vod_pic, vod_content, vod_score, type_id, vod_play_from, vod_play_url)
VALUES (
  '测试电影',
  'https://image.tmdb.org/t/p/w500/example.jpg',
  '这是一部测试电影',
  8.5,
  1,
  'jsyun',
  '第1集$https://example.com/video.m3u8'
);
```

---

## Step 3: 启动项目 (1分钟)

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

访问: http://localhost:5173

---

## ✅ 验证清单

- [ ] 首页显示视频列表
- [ ] 点击视频打开详情页（新标签页）
- [ ] URL包含电影标题 (如: `/movie/123/movie-title`)
- [ ] 分类导航正常工作
- [ ] 相似视频推荐显示

---

## 🆘 遇到问题？

### 页面空白
→ 检查 `.env.local` 配置是否正确

### 没有数据
→ 确认数据库表已创建并有数据

### 图片不显示
→ 检查 `vod_pic` 字段的URL是否有效

---

## 📚 详细文档

需要更多信息？查看：

- **完整配置**: `SUPABASE_SETUP.md`
- **API使用**: `SUPABASE_MIGRATION.md`
- **数据库结构**: `NEXTJS_USAGE_GUIDE.md`

---

**总耗时**: ~6分钟 ⏱️
**难度**: ⭐⭐☆☆☆
