import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { useState } from 'react'
import { DrawerMenu } from './DrawerMenu'

export const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer}>
            <Menu />
          </IconButton>
          <Typography variant="h5" component="div">
            ToDoApp
          </Typography>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={drawerOpen} onClose={toggleDrawer}></DrawerMenu>
    </>
  )
}
