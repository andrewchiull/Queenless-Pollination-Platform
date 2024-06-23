import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AccountCircle from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import { useNavigate } from "react-router-dom";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from "react-router-dom";
import { width } from '@mui/system';
export default function MenuAppBar() {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState({
    welcome: false,
    customer: false,
    message: false,
    login: false,
    register: false, // Add this line
  });

  const switchPage = (anchor, status) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    //const newPageState = {welcome:false, customer:false, message:false};
    setPage({ page, [anchor]: status });
  };

  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleProfileMenuOpen = () => {
    switchPage('/login', true);
  }

  const handleMenuItemClick = (event, text, index) => {
    setSelectedIndex(index);
    switchPage(text, true);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={handleDrawerClose}
      onKeyDown={handleDrawerClose}
    >
      <List>
        {Object.keys(page).map((text, index) => (
          <ListItem key={text} disablePadding component={Link} to={"/" + text}>
            <ListItemButton>
              <ListItemIcon onClick={(event) => handleMenuItemClick(event, text, index)}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ m: 2, p: 1 }}>
      <AppBar position="fixed" color="primary" sx={{ top: 0, bottom: 'auto' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
            onClose={handleDrawerClose}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            PaperProps={{
              sx: { minWidth: 200, width: '20%' },
            }}
            anchor='left'
            open={open}
            onClose={handleDrawerClose}
          >
            {list()}
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            無蜂王授粉計劃
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            //aria-controls={menuId}
            aria-haspopup="true"
            component={Link}
            to={"/login"}
            //onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}