import { useState, useRef, useEffect } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import useLayout from '@hooks/useLayout'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ExpandIcon from '@mui/icons-material/ExpandLess'

import NavAction from '@components/reusable/NavAction'
import AppTooltip from '@components/reusable/AppTooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

import { getProjectNavigation } from '@constants/navigation'
import gsap from 'gsap'

import { isDrawerOpen } from '@stores/ui'

import '@styles/components/buttons/projectNavFolder.css'

export default function ProjectNavFolder() {
  const { projectOwner, projectId } = useParams()
  const { pathname } = useLocation()
  const { t } = useTranslation('ui')
  const containerRef = useRef(null)
  const [open, setOpen] = useState(true)
  const { toggleDrawer, isPreview } = useLayout()

  const drawerOpen = isDrawerOpen.value

  useEffect(() => {
    if(!drawerOpen && open) setOpen(false)
  }, [drawerOpen, open])

  useGSAP(() => {
    if(!drawerOpen){
      gsap.set('.project-nav-item', { autoAlpha: 0, x: -10 })
      gsap.set(['.nav-action__icon', '.nav-action__text'], { autoAlpha: 0 })
      return
    }

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.out',
        overwrite: 'auto'
      }
    })

    if (open) {
      tl.to('.project-nav-item', { 
        autoAlpha: 1, 
        y: 0, 
        x: 0, 
        stagger: 0.08 
      }, 'start')

      tl.fromTo('.nav-action__icon',
        { 
          autoAlpha: 0, 
          scale: 0.5, 
          rotateY: -45,
          z: -50 
        },
        { 
          autoAlpha: 1, 
          scale: 1, 
          rotateY: 0, 
          z: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.05
        }, 'start+=0.1')

      tl.fromTo('.nav-action__text',
        { 
          autoAlpha: 0, 
          x: -12,
          filter: 'blur(4px)'
        },
        { 
          autoAlpha: 1, 
          x: 0, 
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.075
        }, 'start+=0.1')

    } else {
      tl.to('.project-nav-item', {
        x: -8, 
        autoAlpha: 0, 
        stagger: { each: 0.04, from: 'end' },
        ease: 'power3.in' 
      })
    }
  }, { dependencies: [open, drawerOpen], scope: containerRef })

  if (!projectId) return null

  const handleToggle = () => {
    if (!drawerOpen) toggleDrawer(true)
    setOpen(!open)
  }

  const projectItems = getProjectNavigation(projectOwner, projectId)

  return (
    <div className='drawer-action'>
      <AppTooltip title={t('projectActions.navFolder')} placement='right'>
        <ButtonListItem
          component={Button}
          btnProps={{ 
            onClick: handleToggle, 
            className: 'project-nav-trigger flex'
          }}>

          <Box className='flex flex-center project-nav-label-container'>
            <AccountTreeIcon
              fontSize='small'
              className='project-nav-folder-icon'
            />
            <Typography
              className='nav-folder-text project-nav-label'
              variant='caption'>
              {t('projectActions.navFolder')}
            </Typography>
          </Box>

          <ExpandIcon fontSize='small' className='project-nav-expand-icon' />
        </ButtonListItem>
      </AppTooltip>

      <Collapse in={open && drawerOpen}>
        <List 
          className='project-nav-collapse-list' 
          disablePadding 
          ref={containerRef}>
          {projectItems.map((item) => {
            const isActive = item.href.endsWith('/')
              ? pathname === item.href || pathname === item.href.slice(0, -1)
              : pathname.startsWith(item.href)

            return (
              <Box 
                key={item.key} 
                component='li' 
                className='project-nav-item hide-element'>
                <NavAction
                  link={{ 
                    ...item, 
                    to: item.href, 
                    translation: t(item.translation) 
                  }}
                  showText={drawerOpen}
                  isActive={isActive}
                  onClick={() => toggleDrawer(false)}
                />
              </Box>
            )
          })}
        </List>
      </Collapse>
    </div>
  )
}
