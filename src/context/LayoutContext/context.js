import { createContext } from 'react'

const LayoutContext = createContext({
  toggleDrawer: () => null,
  filter: 'default',
  setFilter: (filter) => null,
  updatePreviewer: (previewer) => null,
  updateFilter: (filter) => null,
  isPreview: false,
  triggerUpsell: (reason) => null,
  drawerRef: null
})

export default LayoutContext
