import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetActorDetailQuery, useGetActorWorksQuery } from "src/store/slices/actorSlice";
import CategoryVideoCard from "src/components/CategoryVideoCard";

export function Component() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actorId = parseInt(id || "0");

  const { data: actor, isLoading } = useGetActorDetailQuery(actorId, {
    skip: !actorId,
  });

  const { data: works } = useGetActorWorksQuery(actorId, {
    skip: !actorId,
  });

  useEffect(() => {
    if (actor) {
      document.title = `${actor.actor_name} - 演员详情`;
    }
    return () => {
      document.title = "JJ影视 - 吉吉影视";
    };
  }, [actor]);

  const getActorAvatar = () => {
    if (!actor) return undefined;
    if (actor.actor_pic_supabase) return actor.actor_pic_supabase;
    if (actor.actor_pic) return actor.actor_pic;
    if (actor.tmdb_profile_path) {
      return `https://image.tmdb.org/t/p/w300${actor.tmdb_profile_path}`;
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: 10 }}>
        <Container>
          <Typography sx={{ color: "white" }}>加载中...</Typography>
        </Container>
      </Box>
    );
  }

  if (!actor) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: 10 }}>
        <Container>
          <Typography sx={{ color: "white" }}>演员信息未找到</Typography>
        </Container>
      </Box>
    );
  }

  const avatarUrl = getActorAvatar();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: { xs: 8, sm: 10 } }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          top: { xs: 70, sm: 80 },
          left: { xs: 10, sm: 20 },
          bgcolor: "rgba(24, 24, 24, 0.8)",
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          "&:hover": { bgcolor: "primary.main" },
        }}
      >
        <ArrowBackIcon sx={{ color: "white", fontSize: { xs: 18, sm: 22 } }} />
      </IconButton>

      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 4, mb: 6 }}>
          <Box sx={{ flexShrink: 0 }}>
            <Avatar
              src={avatarUrl}
              alt={actor.actor_name}
              sx={{
                width: { xs: 150, sm: 200, md: 250 },
                height: { xs: 150, sm: 200, md: 250 },
                bgcolor: "#2a2a2a",
                fontSize: { xs: "3rem", sm: "4rem" },
                mx: { xs: "auto", sm: 0 },
              }}
            >
              {!avatarUrl && actor.actor_name.charAt(0)}
            </Avatar>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ color: "white", mb: 2, fontSize: { xs: "1.75rem", sm: "2.5rem" }, fontWeight: 700 }}>
              {actor.actor_name}
            </Typography>

            {actor.actor_en && (
              <Typography variant="h6" sx={{ color: "#999", mb: 3, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                {actor.actor_en}
              </Typography>
            )}

            {actor.actor_tag && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {actor.actor_tag.split(",").map((tag: string, index: number) => (
                  <Chip key={index} label={tag.trim()} size="small" sx={{ bgcolor: "rgba(229, 9, 20, 0.2)", color: "white" }} />
                ))}
              </Stack>
            )}

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2, mb: 3 }}>
              {actor.actor_area && (
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>地区: </Box>
                  {actor.actor_area}
                </Typography>
              )}
              {actor.actor_birthday && (
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>生日: </Box>
                  {actor.actor_birthday}
                </Typography>
              )}
              {actor.actor_birtharea && (
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>出生地: </Box>
                  {actor.actor_birtharea}
                </Typography>
              )}
              {actor.actor_height && (
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>身高: </Box>
                  {actor.actor_height}
                </Typography>
              )}
            </Box>

            {(actor.actor_blurb || actor.tmdb_biography) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontSize: { xs: "1rem", sm: "1.125rem" } }}>
                  简介
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.6 }}>
                  {actor.tmdb_biography || actor.actor_blurb}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {works && works.length > 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, color: "#fff", fontSize: { xs: "1.25rem", sm: "1.5rem" }, fontWeight: 600 }}>
              参演作品
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: { xs: 1.5, sm: 2 } }}>
              {works.map((video: any) => (
                <CategoryVideoCard key={video.id} video={video} openInNewTab={true} />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

Component.displayName = "ActorPage";
