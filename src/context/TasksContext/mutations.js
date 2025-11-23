import lazyImport from '@utils/lazyImport.js'

const mutations = {
  deleteTask: async ({ user, project, task, subtask, deleteSubtasks }) => {
    const deleteTaskFunc = await lazyImport('/src/services/deleteTask')
    return await deleteTaskFunc({
      user,
      project,
      task,
      subtask,
      deleteSubtasks
    })
  },
  updateTask: async ({ user, project, task, data, subtask }) => {
    const updateTaskFunc = await lazyImport('/src/services/updateTask')
    return await updateTaskFunc({ user, project, task, data, subtask })
  }
}

export default mutations
