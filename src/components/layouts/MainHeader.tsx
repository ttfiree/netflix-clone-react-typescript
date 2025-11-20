import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useOffSetTop from "src/hooks/useOffSetTop";
import { APP_BAR_HEIGHT } from "src/constant";
import { PRIMARY_CATEGORIES, getSubCategories } from "src/constant/categories";
import Logo from "../Logo";
import SearchBox from "../SearchBox";
import NetflixNavigationLink from "../NetflixNavigationLink";

const MainHeader = () => {
  const navigate = useNavigate();
  const isOffset = useOffSetTop(APP_BAR_HEIGHT);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElCategory, setAnchorElCategory] = React.useState<{ [key: number]: HTMLElement | null }>({});

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenCategoryMenu = (event: React.MouseEvent<HTMLElement>, categoryId: number) => {
    // 关闭所有其他菜单，只打开当前菜单
    const newState: { [key: number]: HTMLElement | null } = {};
    PRIMARY_CATEGORIES.forEach(cat => {
      newState[cat.type_id] = cat.type_id === categoryId ? event.currentTarget : null;
    });
    setAnchorElCategory(newState);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseCategoryMenu = (categoryId: number) => {
    setAnchorElCategory(prev => ({ ...prev, [categoryId]: null }));
  };

  const handleCategoryClick = (typeId: number, typeEn: string) => {
    navigate(`/genre/${typeEn}`);
    handleCloseNavMenu();
  };

  return (
    <AppBar
      sx={{
        // px: "4%",
        px: "60px",
        height: APP_BAR_HEIGHT,
        backgroundImage: "none",
        ...(isOffset
          ? {
              bgcolor: "primary.main",
              boxShadow: (theme) => theme.shadows[4],
            }
          : { boxShadow: 0, bgcolor: "transparent" }),
      }}
    >
      <Toolbar disableGutters>
        <Logo sx={{ mr: { xs: 2, sm: 4 } }} />

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {PRIMARY_CATEGORIES.map((category) => {
              const subCategories = getSubCategories(category.type_id);
              return (
                <Box key={category.type_id}>
                  <MenuItem 
                    onClick={() => handleCategoryClick(category.type_id, category.type_en)}
                    sx={{ fontWeight: 600 }}
                  >
                    <Typography textAlign="center">{category.type_name}</Typography>
                  </MenuItem>
                  {subCategories.map((subCat) => (
                    <MenuItem
                      key={subCat.type_id}
                      onClick={() => handleCategoryClick(subCat.type_id, subCat.type_en)}
                      sx={{ pl: 4 }}
                    >
                      <Typography textAlign="center" variant="body2">
                        {subCat.type_name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Box>
              );
            })}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Netflix
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        >
          {PRIMARY_CATEGORIES.map((category) => {
            const subCategories = getSubCategories(category.type_id);
            const hasSubCategories = subCategories.length > 0;

            return (
              <Box key={category.type_id} sx={{ position: 'relative' }}>
                <NetflixNavigationLink
                  to={`/genre/${category.type_en}`}
                  variant="subtitle1"
                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                    if (hasSubCategories) {
                      handleOpenCategoryMenu(e, category.type_id);
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  {category.type_name}
                </NetflixNavigationLink>
                
                {hasSubCategories && (
                  <Menu
                    anchorEl={anchorElCategory[category.type_id]}
                    open={Boolean(anchorElCategory[category.type_id])}
                    onClose={() => handleCloseCategoryMenu(category.type_id)}
                    MenuListProps={{
                      onMouseLeave: () => handleCloseCategoryMenu(category.type_id),
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      mt: 1,
                      '& .MuiPaper-root': {
                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  >
                    {subCategories.map((subCat) => (
                      <MenuItem
                        key={subCat.type_id}
                        onClick={() => {
                          handleCategoryClick(subCat.type_id, subCat.type_en);
                          handleCloseCategoryMenu(category.type_id);
                        }}
                        sx={{
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(229, 9, 20, 0.8)',
                          },
                        }}
                      >
                        {subCat.type_name}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            );
          })}
        </Stack>

        <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
          <SearchBox />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default MainHeader;
