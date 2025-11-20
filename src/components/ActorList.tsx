import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ActorWithRole } from "src/types/Actor";
import ActorCard from "./ActorCard";

interface ActorListProps {
  actors: ActorWithRole[];
  title?: string;
}

export default function ActorList({ actors, title = "演员" }: ActorListProps) {
  if (!actors || actors.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "#fff",
          fontSize: { xs: '1rem', sm: '1.125rem' },
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(6, 1fr)',
            lg: 'repeat(8, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {actors.map((actor) => (
          <ActorCard key={actor.actor_id} actor={actor} />
        ))}
      </Box>
    </Box>
  );
}
