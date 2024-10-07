"use client";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "@/hooks/useNavigate";
import { usePathname } from "next/navigation";
import { MouseEvent, useState } from "react";
import Image from "next/image";
import mainlogo from "@/assets/logo/mainlogo.png";
import { signOut } from "next-auth/react";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useHeaderName } from "@/hooks/useHeaderName";

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Container({ children }: any) {
  const navigate = useNavigate();
  const pathname = usePathname();
  const headerName = useHeaderName();

  const [list, setList] = useState([
    {
      title: "Home",
      icon: <DashboardIcon />, // Changed from HomeIcon
      children: [
        {
          title: "Banner",
          icon: <ImageIcon />, // Changed from CollectionsIcon
          url: "/banner",
          children: [],
        },
      ],
    },
    {
      title: "Inventory",
      icon: <InventoryIcon />, // Changed from CardGiftcardIcon
      children: [
        {
          title: "Product",
          icon: <ShoppingCartIcon />, // Changed from CardGiftcardIcon
          url: "/product",
          children: [],
        },
        {
          title: "Category",
          icon: <CategoryIcon />, // Changed from PublicIcon
          url: "/category",
          children: [],
        },
        {
          title: "Brands",
          icon: <LocalOfferIcon />, // Changed from GroupIcon
          url: "/brand",
          children: [],
        },
      ],
    },
    {
      title: "Orders",
      icon: <ShoppingBagIcon />, // Changed from PeopleIcon
      url: "/order",
      children: [],
    },
    {
      title: "Users",
      icon: <PersonIcon />, // Changed from PeopleIcon
      url: "/user",
      children: [],
    },
  ]);

  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState<{ [key: string]: boolean }>({ Home: true });
  const [openMenu, setOpenMenu] = useState<string>("Home");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickTab = (url: any, title?: any) => {
    navigate(url);
    setOpenMenu(title);
  };

  const handleSubMenuToggle = (title: string) => {
    setOpenSubMenu((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    if (window.confirm("Are you sure you want to log out ?")) {
      signOut();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: "#fff" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon sx={{ color: "#6d3481" }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "600" }} color={"#6d3481"}>
            {headerName}
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ color: "#6d3481", fontSize: 35 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={() => handleLogOut()}>Log-Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ bgcolor: "#fff" }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image src={mainlogo} alt="mainlogo" width={165} height={45} style={{ objectFit: "contain" }} />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: "#6d3481" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "#6d3481" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {list?.map((item: any) => (
            <div key={item.title}>
              <ListItem
                disablePadding
                style={openSubMenu[item.title] || pathname === item.url ? { backgroundColor: "#e8e8e8" } : {}}
              >
                <ListItemButton
                  onClick={() => (item.children.length ? handleSubMenuToggle(item.title) : handleClickTab(item.url))}
                >
                  <ListItemIcon style={openMenu === item.title || pathname === item.url ? { color: "#6d3481" } : {}}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    style={openMenu === item.title || pathname === item.url ? { color: "#6d3481" } : {}}
                  />
                  {item.children.length ? openSubMenu[item.title] ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItemButton>
              </ListItem>
              {item.children.length > 0 && (
                <Collapse in={openSubMenu[item.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child: any) => (
                      <ListItem
                        key={child.url}
                        disablePadding
                        style={pathname === child.url ? { backgroundColor: "#e8e8e8" } : {}}
                      >
                        <ListItemButton onClick={() => handleClickTab(child.url, item.title)}>
                          <ListItemIcon
                            style={
                              pathname === child?.url
                                ? { color: "#6d3481", paddingLeft: "20px" }
                                : { paddingLeft: "20px" }
                            }
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.title}
                            style={pathname === child.url ? { color: "#6d3481" } : {}}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
