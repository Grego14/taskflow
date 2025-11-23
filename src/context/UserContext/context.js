import i18n from '@/i18n'
import getLocale from '@utils/getLocale'
import { createContext } from 'react'

const UserContext = createContext({
  metadata: {
    lastEditedProject: '',
    lastUsedFilter: 'default'
  },
  preferences: {
    lang: i18n.language,
    theme: 'light',
    previewer: 'list',
    locale: getLocale(i18n.language)
  },
  profile: {
    username: '',
    avatar: '',
    email: ''
  },
  update: () => {},
  preview: 'list',
  updatePreviewer: () => {}
})

export default UserContext
