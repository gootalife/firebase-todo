import { AppBar, Button, IconButton, MenuItem, Toolbar, Typography, Menu } from '@mui/material'
import { AccountCircle, Menu as MenuIcon, Logout, Person } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { DrawerMenu } from 'components/DrawerMenu'
import { useAuth } from 'contexts/AuthProvider'

export const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const { currentUser, login, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ログイン時にアイコンのメニューが開くのを防ぐ
  useEffect(() => {
    setAnchorEl(null)
  }, [currentUser])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            ToDoApp
          </Typography>
          {currentUser ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={anchorEl != null}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={login}>
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <DrawerMenu open={drawerOpen} onClose={toggleDrawer}></DrawerMenu>
    </>
  )
}
