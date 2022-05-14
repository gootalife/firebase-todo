import { Box, List, Drawer, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Inbox, Mail } from '@mui/icons-material'

type Props = {
  open: boolean
  onClose: () => void
}

export const DrawerMenu = (props: Props) => {
  const menuItems = ['Menu1', 'Menu2', 'Menu3', 'Menu4']

  return (
    <Drawer open={props.open} onClose={props.onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((text) => (
            <ListItem button key={text} onClick={props.onClose}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}
