import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import NavAction from '@components/reusable/NavAction'
import Tooltip from '@mui/material/Tooltip'

import ExpandIcon from '@mui/icons-material/ExpandLess'

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import useLayout from '@hooks/useLayout'

import { getProjectNavigation } from '@constants/navigation'
import gsap from 'gsap'

const LABEL_PROPS = {
  variant: 'caption',
  textTransform: 'uppercase',
  fontWeight: 700,
  color: 'text.secondary',
  letterSpacing: '0.5px'
}

export default function ProjectCollapsibleSection() {
  const { projectOwner, projectId } = useParams()
  const { pathname } = useLocation()
  const { t } = useTranslation('ui')
  const containerRef = useRef(null)
  const [open, setOpen] = useState(true)
  const { drawerOpen, toggleDrawer } = useLayout()

  useGSAP(() => {
    if (open && drawerOpen) {
      gsap.fromTo('.project-nav-item',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.1, ease: 'power2.out', duration: 0.4 }
      )
    }
  }, { dependencies: [open, drawerOpen], scope: containerRef })

  if (!projectId) return null

  const handleToggle = () => {
    if (!drawerOpen) {
      toggleDrawer(true)
      return
    }

    setOpen(!open)
  }

  const projectItems = getProjectNavigation(projectOwner, projectId)

  const navElements = []
  for (const item of projectItems) {
    // NavAction component uses "to" instead of "href"
    const { to, translation, href, ...other } = item
    const link = { ...other, to: href, translation: t(translation) }

    const isActive = item.href.endsWith('/')
      ? pathname === item.href || pathname === item.href.slice(0, -1)
      : pathname.startsWith(item.href)

    navElements.push(
      <Box
        key={item.key}
        className='project-nav-item'
        component='li'
        sx={{ listStyle: 'none' }}>
        <NavAction
          link={link}
          showText={drawerOpen}
          isActive={isActive}
          onClick={() => toggleDrawer(false)}
        />
      </Box>
    )
  }

  return (
    <List
      className='drawer-action'
      ref={containerRef}
      disablePadding
      sx={{ mt: 0.5 }}>
      <Tooltip title={t('projectActions.navFolder')} placement='right'>
        <ListItemButton
          onClick={handleToggle}
          sx={{
            px: 1.5,
            py: 1,
            justifyContent: drawerOpen ? 'initial' : 'center'
          }}>
          <ListItemIcon sx={{
            minWidth: 0,
            mr: drawerOpen ? 1.5 : '0',
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <AccountTreeIcon fontSize='small' />
          </ListItemIcon>

          <>
            <ListItemText
              primary={t('projectActions.navFolder')}
              sx={{ flexGrow: drawerOpen ? 1 : 0 }}
              slotProps={{
                primary: {
                  className: 'nav-folder-text',
                  ...LABEL_PROPS,
                  sx: {
                    ...(!drawerOpen ? ({
                      position: 'absolute',
                      opacity: 0
                    }) : {})
                  },
                  'aria-hidden': !drawerOpen
                }
              }}
            />
            <ExpandIcon
              fontSize='small'
              sx={{
                transition: 'rotate 0.15s ease-in-out',
                rotate: open ? '180deg' : 0,
                ...(!drawerOpen ? ({
                  position: 'absolute',
                  opacity: 0
                }) : {})
              }}
            />
          </>
        </ListItemButton>
      </Tooltip>

      <Collapse in={open && drawerOpen} timeout='auto' unmountOnExit>
        <List sx={{ pl: 1.25 }} disablePadding>
          {navElements}
        </List>
      </Collapse>
    </List>
  )
}
