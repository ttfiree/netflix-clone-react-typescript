import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { useSearchVideosQuery } from "src/store/slices/supabaseSlice";
import CategoryVideoCard from "src/components/CategoryVideoCard";

export function Component() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [page, setPage] = useState(1);

  // 搜索视频
  const { data: videos, isLoading, error } = useSearchVideosQuery(
    { keyword, page },
    { skip: !keyword }
  );

  useEffect(() => {
    if (keyword) {
      document.title = `搜索: ${keyword} - Netflix Clone`;
    }
  }, [keyword]);

  // 切换关键词时重置页码
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  // 切换页码时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (!keyword) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#141414",
          pt: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "white", fontSize: "1.5rem" }}>
          请输入搜索关键词
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#141414",
          pt: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#141414",
          pt: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "white", fontSize: "1.5rem" }}>
          搜索失败，请稍后重试
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: { xs: 10, sm: 12 } }}>
      <Container maxWidth="xl">
        {/* 搜索标题 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            搜索结果: "{keyword}"
          </Typography>
          {videos && videos.total_results > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              找到 {videos.total_results} 部相关影片
            </Typography>
          )}
        </Box>

        {/* 搜索结果 */}
        {videos && videos.results.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {videos.results.map((video) => (
              <CategoryVideoCard key={video.id} video={video} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <Typography sx={{ color: "text.secondary", fontSize: "1.2rem" }}>
              没有找到相关内容，请尝试其他关键词
            </Typography>
          </Box>
        )}

        {/* 分页 */}
        {videos && videos.total_pages > 1 && (
          <Box 
            sx={{ 
              mt: 6, 
              mb: 4, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Pagination
              count={videos.total_pages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  bgcolor: '#e50914',
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ color: "text.secondary" }}
            >
              第 {page} / {videos.total_pages} 页
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

Component.displayName = "SearchPage";
