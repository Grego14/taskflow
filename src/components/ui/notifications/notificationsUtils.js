import formatTimeAgo from '@utils/formatTimeAgo'
import formatTimestamp from '@utils/formatTimestamp'

export const isInviteNotification = data => {
  return (
    !data?.invitedBy ||
    !data?.projectName ||
    data.accepted === undefined ||
    !data?.projectId ||
    !data?.projectOwner
  )
}

export const getNotificationDate = (date, locale) =>
  formatTimeAgo(formatTimestamp(date, locale).raw, locale)
