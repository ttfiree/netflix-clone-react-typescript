import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { ActorWithRole } from "src/types/Actor";

interface ActorCardProps {
  actor: ActorWithRole;
}

export default function ActorCard({ actor }: ActorCardProps) {
  const handleClick = () => {
    window.open(`/actor/${actor.actor_id}`, '_blank');
  };

  // 获取演员头像
  const getActorAvatar = () => {
    if (actor.actor_pic_supabase) {
      return actor.actor_pic_supabase;
    }
    if (actor.actor_pic) {
      return actor.actor_pic;
    }
    if (actor.tmdb_profile_path) {
      return `https://image.tmdb.org/t/p/w185${actor.tmdb_profile_path}`;
    }
    return undefined;
  };

  const avatarUrl = getActorAvatar();

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          '& .actor-name': {
            color: 'primary.main',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* 演员头像 */}
        <Avatar
          src={avatarUrl}
          alt={actor.actor_name}
          sx={{
            width: { xs: 60, sm: 80, md: 100 },
            height: { xs: 60, sm: 80, md: 100 },
            bgcolor: '#2a2a2a',
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          {!avatarUrl && actor.actor_name.charAt(0)}
        </Avatar>

        {/* 演员名字 */}
        <Typography
          className="actor-name"
          sx={{
            color: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500,
            textAlign: 'center',
            transition: 'color 0.3s ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {actor.actor_name}
        </Typography>

        {/* 角色信息（可选） */}
        {actor.role && actor.role !== 'actor' && (
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              textAlign: 'center',
            }}
          >
            {actor.role === 'director' ? '导演' : actor.role === 'writer' ? '编剧' : '演员'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
