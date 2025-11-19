import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ParsedPlayData } from 'src/types/Supabase';

interface AppleCMSPlayerProps {
  playData: ParsedPlayData;
  title: string;
}

// 播放器配置接口
interface PlayerConfig {
  name: string;
  url: string;
  encode: boolean;
}

// 数据源和播放器的映射关系
// 键名是数据源名称（小写），值是对应的播放器配置
const SOURCE_PLAYER_MAP: Record<string, PlayerConfig> = {
  // 极速资源 m3u8
  'jsm3u8': {
    name: 'JSJiexi',
    url: 'https://jsjiexi.com/play/?url=',
    encode: false, // 官方播放器不需要编码
  },
  // 可以添加其他数据源的播放器配置
  // 例如：
  // 'hnm3u8': {
  //   name: 'HN Player',
  //   url: 'https://hn-player.com/play/?url=',
  //   encode: true,
  // },
};

// 默认播放器（当找不到对应数据源的播放器时使用）
const DEFAULT_PLAYER: PlayerConfig = {
  name: '默认播放器',
  url: 'https://jsjiexi.com/play/?url=',
  encode: false,
};

// 根据数据源名称获取对应的播放器配置
function getPlayerForSource(sourceName: string): PlayerConfig {
  const key = sourceName.toLowerCase();
  return SOURCE_PLAYER_MAP[key] || DEFAULT_PLAYER;
}

export default function AppleCMSPlayer({ playData, title }: AppleCMSPlayerProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  // 调试信息
  console.log('播放数据:', playData);
  console.log('播放源数量:', playData.sources.length);
  playData.sources.forEach((source, idx) => {
    console.log(`播放源 ${idx}: ${source.name}, 集数: ${source.episodes.length}`);
  });

  const currentSource = playData.sources[currentSourceIndex];
  const currentEpisode = currentSource?.episodes[currentEpisodeIndex];
  
  // 判断当前是否是 m3u8 播放源
  const isM3u8Source = currentSource && (
    currentSource.name.toLowerCase().includes('m3u8') || 
    currentEpisode?.url.includes('.m3u8')
  );

  // 获取当前数据源对应的播放器
  const currentPlayer = isM3u8Source ? getPlayerForSource(currentSource.name) : null;

  // 当切换播放源时，重置集数
  useEffect(() => {
    setCurrentEpisodeIndex(0);
  }, [currentSourceIndex]);

  if (!playData.sources || playData.sources.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          bgcolor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Typography>暂无播放源</Typography>
      </Box>
    );
  }

  if (!currentEpisode) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          bgcolor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Typography>播放地址错误</Typography>
      </Box>
    );
  }

  // 判断播放器类型
  const getPlayerUrl = () => {
    const url = currentEpisode.url;
    const sourceName = currentSource.name.toLowerCase();

    console.log('=== 播放器 URL 生成 ===');
    console.log('数据源名称:', currentSource.name);
    console.log('集数名称:', currentEpisode.name);
    console.log('原始 URL:', url);
    console.log('是否 M3U8:', isM3u8Source);

    // jsyun 直接播放，不需要任何转换
    if (sourceName === 'jsyun' || sourceName.includes('jsyun')) {
      console.log('✅ jsyun 源，直接使用原始 URL');
      console.log('最终播放地址:', url);
      return url;
    }

    // m3u8 播放源处理
    if (isM3u8Source && currentPlayer) {
      // 根据播放器配置决定是否编码 URL
      const videoUrl = currentPlayer.encode ? encodeURIComponent(url) : url;
      const playerUrl = `${currentPlayer.url}${videoUrl}`;
      console.log('✅ M3U8 源，使用播放器:', currentPlayer.name);
      console.log('是否编码:', currentPlayer.encode);
      console.log('最终播放地址:', playerUrl);
      return playerUrl;
    }

    // 其他直接播放
    console.log('✅ 其他源，直接使用原始 URL');
    console.log('最终播放地址:', url);
    return url;
  };

  return (
    <Box>
      {/* 播放器 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9
          bgcolor: '#000',
          mb: 3,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <iframe
          src={getPlayerUrl()}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          frameBorder="0"
          marginWidth={0}
          marginHeight={0}
          scrolling="no"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
          allowFullScreen
        />
      </Box>

      {/* 当前播放信息 */}
      <Box sx={{ mb: 3, px: { xs: 0, sm: 0 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            mb: 0.5,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          正在播放: {currentEpisode.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          播放源: {currentSource.name}
          {isM3u8Source && currentPlayer && ` (${currentPlayer.name})`}
        </Typography>
      </Box>

      {/* 播放源切换 - 始终显示 */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'white', 
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          切换播放源 ({playData.sources.length})
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {playData.sources.map((source, index) => (
            <Button
              key={index}
              size="small"
              variant={currentSourceIndex === index ? 'contained' : 'outlined'}
              onClick={() => setCurrentSourceIndex(index)}
              sx={{
                minWidth: { xs: '60px', sm: '80px' },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                // 选中状态
                ...(currentSourceIndex === index ? {
                  bgcolor: '#e50914',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                } : {
                  // 未选中状态
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }),
              }}
            >
              {source.name}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* 集数选择 - 始终显示 */}
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'white', 
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          选择集数 ({currentSource.episodes.length})
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(4, 1fr)',
              sm: 'repeat(6, 1fr)',
              md: 'repeat(8, 1fr)',
              lg: 'repeat(10, 1fr)',
            },
            gap: { xs: 0.75, sm: 1 },
            maxHeight: { xs: '200px', sm: '300px' },
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.5)',
              },
            },
          }}
        >
          {currentSource.episodes.map((episode, index) => (
            <Button
              key={index}
              size="small"
              variant={currentEpisodeIndex === index ? 'contained' : 'outlined'}
              onClick={() => setCurrentEpisodeIndex(index)}
              sx={{
                minWidth: 'auto',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                py: { xs: 0.5, sm: 0.75 },
                // 选中状态
                ...(currentEpisodeIndex === index ? {
                  bgcolor: '#e50914',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                } : {
                  // 未选中状态
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }),
              }}
            >
              {episode.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
