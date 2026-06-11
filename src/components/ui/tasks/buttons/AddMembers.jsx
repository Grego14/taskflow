import { lazy, Suspense } from 'preact/compat'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import IconButton from '@mui/material/IconButton'
import AppTooltip from '@components/reusable/AppTooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

const AddMembersDialog = lazy(() =>
  import('@components/reusable/dialogs/addMembers/AddMembersDialog'))

import useProject from '@hooks/useProject'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useLayout from '@hooks/useLayout'

export default function AddMembers() {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  const { projectId } = useParams()
  const { data } = useProject()
  const { isPreview, triggerUpsell } = useLayout()

  const handleClick = () => {
    if (isPreview) {
      triggerUpsell('add-members')
      return
    }

    setOpen(true)
  }

  return (
    <>
      <AppTooltip title={t('buttons.addMembers')}>
        <ButtonListItem
          component={IconButton}
          btnProps={{
            onClick: handleClick,
            disabled: data?.isArchived,
            className: 'hide-element'
          }}>
          <PersonAddIcon fontSize='medium' />
        </ButtonListItem>
      </AppTooltip>

      <Suspense fallback={null}>
        {open && <AddMembersDialog open={open} setOpen={setOpen} />}
      </Suspense>
    </>
  )
}
