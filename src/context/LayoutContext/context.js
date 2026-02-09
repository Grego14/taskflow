import { createContext } from 'react'

const LayoutContext = createContext({
  drawerOpen: false,
  setDrawerOpen: () => { },
  filter: 'default',
  setFilter: (filter) => { },
  updatePreviewer: (previewer) => { },
  updateFilter: (filter) => { }
})

export default LayoutContext
