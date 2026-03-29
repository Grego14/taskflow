import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import NavAction from '@components/reusable/NavAction'
import Tooltip from '@mui/material/Tooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

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
  const { drawerOpen, toggleDrawer, isPreview } = useLayout()

  useGSAP(() => {
    const labels = '.nav-action__text'
    const icons = '.nav-action__icon'

    const tl = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        overwrite: 'auto',
        stagger: 0.2
      }
    })

    if (drawerOpen) {
      if (open) {
        tl.to('.nav-action', { autoAlpha: 1, y: 0, x: 0 }, 'openStart')

        tl.fromTo(icons,
          { autoAlpha: 0, x: -10, rotateZ: -90 },
          { autoAlpha: 1, x: 0, rotateZ: 0, duration: 0.35 }, 'openStart+=0.25')
          .fromTo(labels,
            { autoAlpha: 0, x: -20, y: -25 },
            { autoAlpha: 1, x: 0, y: 0 },
            '<0.15')
      } else {
        tl.to('.nav-action', { x: -10, y: -25, autoAlpha: 0, stagger: 0.15 })
      }
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
        component='li'
        sx={{
          listStyle: 'none',
          overflow: 'hidden',
          perspective: '1000px',
          perspectiveOrigin: '0 50%'
        }}>
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
        <ButtonListItem
          component={Button}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            '.is-open &': {
              justifyContent: 'initial'
            }
          }}
          btnProps={{
            onClick: handleToggle,
            sx: {
              width: '100%',
              px: 1.5,
              py: 1.5
            }
          }}>
          <Box
            className='flex flex-center'
            sx={{ mr: 0, '.is-open &': { mr: 'auto' } }}>
            <AccountTreeIcon
              fontSize='small'
              sx={{
                minWidth: 0,
                mr: 0,
                '.is-open &': { mr: 1.5 },
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            />

            <Typography
              className='nav-folder-text'
              {...LABEL_PROPS}
              sx={{
                '.is-closed &': {
                  position: 'absolute',
                  opacity: 0,
                  visibility: 'hidden'
                }
              }}>
              {t('projectActions.navFolder')}
            </Typography>
          </Box>

          <>
            <ExpandIcon
              fontSize='small'
              sx={{
                transition: 'rotate 0.15s ease-in-out',
                rotate: open ? '180deg' : 0,
                '.is-closed &': {
                  position: 'absolute',
                  opacity: 0,
                  visibility: 'hidden'
                }
              }}
            />
          </>
        </ButtonListItem>
      </Tooltip>

      <Collapse in={open && drawerOpen} timeout='auto'>
        <List sx={{ pl: 1.25 }} disablePadding>
          {navElements}
        </List>
      </Collapse>
    </List>
  )
}
