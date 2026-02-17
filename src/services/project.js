import { dbAdapter } from './dbAdapter'

const projectService = {
  getDrawerQueries: (uid) => ({
    userProjects: dbAdapter.getQuery(
      dbAdapter.getColRef('users', uid, 'projects'),
      ['drawerData', '==', true]
    ),
    externalProjects: dbAdapter.getGroupQuery(
      'projects',
      ['members', 'array-contains', uid],
      ['drawerData', '==', true]
    )
  }),

  formatProject: (doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      owner: data.owner
    }
  }
}

export default projectService
