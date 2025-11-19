-- ============================================
-- 批量更新播放地址域名
-- 从 vv.jisuzyv.com 更新到 bf.jisuziyuanbf.com
-- ============================================

-- 1. 先查看需要更新的记录数量
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN vod_play_url LIKE '%vv.jisuzyv.com%' THEN 1 END) as records_to_update
FROM mac_vod;

-- 2. 预览将要更新的记录（前10条）
SELECT 
  vod_id,
  vod_name,
  vod_play_from,
  vod_play_url as old_url,
  REPLACE(vod_play_url, 'vv.jisuzyv.com', 'bf.jisuziyuanbf.com') as new_url
FROM mac_vod
WHERE vod_play_url LIKE '%vv.jisuzyv.com%'
LIMIT 10;

-- 3. 执行批量更新
-- 注意：执行前请先备份数据！
UPDATE mac_vod
SET vod_play_url = REPLACE(vod_play_url, 'vv.jisuzyv.com', 'bf.jisuziyuanbf.com')
WHERE vod_play_url LIKE '%vv.jisuzyv.com%';

-- 4. 验证更新结果
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN vod_play_url LIKE '%vv.jisuzyv.com%' THEN 1 END) as old_domain_count,
  COUNT(CASE WHEN vod_play_url LIKE '%bf.jisuziyuanbf.com%' THEN 1 END) as new_domain_count
FROM mac_vod;

-- 5. 查看更新后的示例记录
SELECT 
  vod_id,
  vod_name,
  vod_play_from,
  vod_play_url
FROM mac_vod
WHERE vod_play_url LIKE '%bf.jisuziyuanbf.com%'
LIMIT 10;

-- ============================================
-- 如果需要回滚（谨慎使用）
-- ============================================
-- UPDATE mac_vod
-- SET vod_play_url = REPLACE(vod_play_url, 'bf.jisuziyuanbf.com', 'vv.jisuzyv.com')
-- WHERE vod_play_url LIKE '%bf.jisuziyuanbf.com%';
