import { createContext } from 'react'

const LayoutContext = createContext({
  drawerOpen: false,
  setDrawerOpen: () => { },
  filter: 'default',
  setFilter: (filter) => { },
  updatePreviewer: (previewer) => { },
  updateFilter: (filter) => { },
  isPreview: false,
  triggerUpsell: (reason) => { }
})

export default LayoutContext
