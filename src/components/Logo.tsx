import Box, { BoxProps } from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

export default function Logo({ sx }: BoxProps) {
  return (
    <RouterLink to="/">
      <Box
        component="img"
        alt="JJ影视 - 吉吉影视"
        src="/logo.png"
        width="75"
        height="32"
        sx={{
          height: { xs: 32, sm: 40 },
          width: "auto",
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 0.8,
          },
          ...sx,
        }}
      />
    </RouterLink>
  );
}
