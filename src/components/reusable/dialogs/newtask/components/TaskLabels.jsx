// components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LabelsPreview from './LabelsPreview'
import MatchingLabels from './MatchingLabels'

// hooks
import useProject from '@hooks/useProject'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import getInteraction from '@utils/getInteraction'
// utils
import getProjectData from '@utils/getProjectData'

const labelRegex = /^[a-zA-Z0-9_()#%!@\.\-\,\?\*\/\\$+¿]+$/

export default function TaskLabels({ actualLabels, changeLabels }) {
  const { t } = useTranslation('dialogs')
  const { data: actualProjectData } = useProject()

  // this component is also used outside the ProjectContext so we use useParams
  // instead of useProject to get the projectId
  const { projectId } = useParams()

  const [actualLabel, setActualLabel] = useState('')
  const [showProjectLabels, setShowProjectLabels] = useState(false)
  const [error, setError] = useState('')

  const matchingLabels = useMemo(() => {
    // if there isn't a label show the initial 10 labels of the project
    if (!actualLabels?.length > 0 && !actualLabel)
      return actualProjectData?.labels?.slice(0, 10)

    const searchTerm = actualLabel.toLowerCase()

    if (!actualProjectData.labels || actualProjectData.labels.length < 1) return

    return actualProjectData.labels
      .filter(
        // exclude labels already being used
        label =>
          label.toLowerCase().includes(searchTerm) &&
          !actualLabels.includes(label)
      )
      .sort((a, b) => {
        // sort by coincidence at the start
        const aStartsWith = a.toLowerCase().startsWith(searchTerm)
        const bStartsWith = b.toLowerCase().startsWith(searchTerm)

        if (aStartsWith && !bStartsWith) return -1
        if (bStartsWith && !aStartsWith) return 1

        // sort by length
        return a.length - b.length
      })
      .slice(0, 10) // limit labels to 10
  }, [actualProjectData?.labels, actualLabel, actualLabels])

  const handleLabelsChange = e => {
    const value = e.target.value.trim()

    setActualLabel(value)
    setShowProjectLabels(matchingLabels?.length > 0 && !error)

    if (!value) return

    if (labelRegex.test(value)) return setError('')

    setError(t('newtask.errors.label'))
  }

  const handleSpecialKeys = e => {
    const { isSpace, isEnter } = getInteraction(e)
    const newLabel = e.target.value.trim()

    if (error || !newLabel || (!isSpace && !isEnter)) return

    changeLabels([...new Set([...actualLabels, newLabel])])

    setError('')
    setActualLabel('')
    e.target.value = ''
    setShowProjectLabels(false)
  }

  const handleProjectLabelsInteraction = e => {
    const { isEnter, isClick } = getInteraction(e)

    if (!isEnter && !isClick) return

    const label =
      e.target.dataset?.label ||
      e.target.closest('[data-label]')?.dataset?.label

    const newLabel = label?.trim()

    if (!newLabel) return

    changeLabels([...new Set([...actualLabels, newLabel])])

    setActualLabel('')
    setShowProjectLabels(false)
  }

  const handleLabelDeletion = e => {
    // hide the projectLabels if the user removes an already added label
    // so we prevent to make the ui jump when the removed labels are being added again
    setShowProjectLabels(false)

    const { isEnter, isClick } = getInteraction(e)

    if (!isEnter && !isClick) return

    const labelToDelete = e.target.value || e.target.closest('button').value

    const newLabels = [...actualLabels].filter(label => label !== labelToDelete)
    changeLabels(newLabels)
  }

  if (!actualProjectData?.id) return null

  return (
    <div className='task-labels flex flex-column'>
      <div className='task-labels-selector' aria-live='polite'>
        <TextField
          label={t('newtask.taskLabels')}
          id='task-labels'
          value={actualLabel}
          size='small'
          fullWidth
          placeholder={t('newtask.taskLabelsPlaceholder')}
          onChange={handleLabelsChange}
          onKeyUp={handleSpecialKeys}
          onFocus={() =>
            setShowProjectLabels(
              !error &&
                actualProjectData?.labels?.length > 0 &&
                matchingLabels?.length > 0
            )
          }
          aria-invalid={!!error}
          error={!!error}
          helperText={error}
        />

        {showProjectLabels && (
          <MatchingLabels
            handleInteraction={handleProjectLabelsInteraction}
            labels={matchingLabels}
            showLabels={setShowProjectLabels}
          />
        )}

        <LabelsPreview
          actualLabels={actualLabels}
          deleteLabel={handleLabelDeletion}
        />
      </div>
    </div>
  )
}
