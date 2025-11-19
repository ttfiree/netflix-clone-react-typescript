// 测试解析函数
function parsePlayUrl(playFrom, playUrl) {
  if (!playFrom || !playUrl) {
    return { sources: [] };
  }

  // 自动检测分隔符（$$$ 或 $$）
  const sourceSeparator = playFrom.includes('$$$') ? '$$$' : '$$';
  const urlSeparator = playUrl.includes('$$$') ? '$$$' : '$$';

  console.log('原始数据:');
  console.log('playFrom:', playFrom);
  console.log('playUrl:', playUrl);
  console.log('检测到的分隔符:', { sourceSeparator, urlSeparator });

  const sources = playFrom.split(sourceSeparator);
  const urls = playUrl.split(urlSeparator);

  console.log('\n分割后:');
  console.log('sources:', sources);
  console.log('urls:', urls);

  const result = {
    sources: sources.map((name, idx) => ({
      name: name.trim(),
      episodes: urls[idx]?.split('#').map(ep => {
        const [epName, epUrl] = ep.split('$');
        return { name: epName?.trim() || '', url: epUrl?.trim() || '' };
      }).filter(ep => ep.url) || []
    })).filter(source => source.episodes.length > 0)
  };

  console.log('\n解析结果:');
  console.log(JSON.stringify(result, null, 2));

  return result;
}

// 测试用例1: 使用 $$ 分隔符
console.log('=== 测试用例1: $$ 分隔符 ===');
parsePlayUrl(
  'jsyun$$jsm3u8',
  '第1集$https://example.com/1.mp4#第2集$https://example.com/2.mp4$$第1集$https://example.com/m3u8/1.m3u8#第2集$https://example.com/m3u8/2.m3u8'
);

console.log('\n\n=== 测试用例2: $$$ 分隔符 ===');
parsePlayUrl(
  'jsyun$$$jsm3u8',
  '第1集$https://example.com/1.mp4#第2集$https://example.com/2.mp4$$$第1集$https://example.com/m3u8/1.m3u8#第2集$https://example.com/m3u8/2.m3u8'
);

console.log('\n\n=== 测试用例3: 单个播放源 ===');
parsePlayUrl(
  'jsyun',
  '第1集$https://example.com/1.mp4#第2集$https://example.com/2.mp4'
);

console.log('\n\n请在浏览器控制台中查看实际的 vod_play_from 和 vod_play_url 数据');
console.log('然后将实际数据粘贴到这里测试');
