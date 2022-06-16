import { AppBar, Button, IconButton, MenuItem, Toolbar, Typography, Menu, Box } from '@mui/material'
import { AccountCircle, Menu as MenuIcon, Logout, Person } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { DrawerMenu } from 'components/DrawerMenu'
import { useAuth } from 'contexts/AuthProvider'
import { path } from 'utils/path'
import Link from 'next/link'

export const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const { currentUser, login, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ログイン時にアイコンのメニューが開くのを防ぐ
  useEffect(() => {
    setAnchorEl(null)
  }, [currentUser])

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = async () => {
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
          <Link href={path.home}>
            <Typography variant="h5" component="div" sx={{ cursor: 'pointer' }}>
              ToDoApp
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }}></Box>
          {currentUser ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={openMenu}
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
                onClose={closeMenu}
              >
                <Link href={path.user}>
                  <MenuItem onClick={closeMenu}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                </Link>
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
