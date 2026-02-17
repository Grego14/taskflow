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

  formatDrawerProject: (doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      owner: data.owner
    }
  },

  getProjectsQueries: (uid) => ({
    userProjects: dbAdapter.getGroupQuery(
      'projects',
      ['createdBy', '==', uid],
      ['drawerData', '==', false]
    ),
    externalProjects: dbAdapter.getGroupQuery(
      'projects',
      ['members', 'array-contains', uid],
      ['createdBy', '!=', uid],
      ['drawerData', '==', false]
    )
  }),

  formatProject: (doc) => ({
    id: doc.id,
    ...doc.data()
  })
}

export default projectService
