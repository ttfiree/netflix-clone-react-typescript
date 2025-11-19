import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { getCategoryByEn } from "src/constant/categories";
import { useGetVideosByTypeQuery } from "src/store/slices/supabaseSlice";
import CategoryVideoCard from "src/components/CategoryVideoCard";

export function Component() {
  const { categoryEn } = useParams<{ categoryEn: string }>();
  const [page, setPage] = useState(1);

  // 根据英文名获取分类信息
  const category = getCategoryByEn(categoryEn || '');

  // 获取该分类的视频列表
  const { data: videos, isLoading, error } = useGetVideosByTypeQuery(
    { typeId: category?.type_id || 0, page, limit: 20 },
    { skip: !category }
  );

  useEffect(() => {
    if (category) {
      document.title = `${category.type_name} - Netflix Clone`;
    }
  }, [category]);

  // 切换分类时重置页码
  useEffect(() => {
    setPage(1);
  }, [categoryEn]);

  // 切换页码时滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (!category) {
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
          分类不存在
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
          加载失败，请稍后重试
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: { xs: 10, sm: 12 } }}>
      <Container maxWidth="xl">
        {/* 分类标题 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            {category.type_name}
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
              共 {videos.total_results} 部影片
            </Typography>
          )}
        </Box>

        {/* 视频列表 */}
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
              该分类暂无内容
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
              第 {page} / {videos.total_pages} 页，共 {videos.total_results} 部影片
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

Component.displayName = "CategoryPage";
