import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import db from '@/db'

export default function waitForCompletedDate({
  taskId,
  parentId,
  isSubtask,
  project,
  owner,
  dueDate
}) {
  const projectRef = doc(db, 'users', owner, 'projects', project)
  let taskRef = doc(projectRef, 'tasks', isSubtask ? parentId : taskId)

  if (isSubtask) {
    taskRef = doc(taskRef, 'subtasks', taskId)
  }

  const unsubscribe = onSnapshot(taskRef, docSnapshot => {
    const taskData = docSnapshot.data()
    const { completedDate } = taskData

    if (completedDate && dueDate) {
      const completedTime = taskData.completedDate.toDate()
      const wasOnTime = completedTime <= dueDate

      unsubscribe()

      updateDoc(taskRef, { wasOnTime })
    }
  })
}
