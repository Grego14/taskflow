import db from '@/db'
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  writeBatch,
  arrayUnion,
  deleteDoc,
  updateDoc,
  onSnapshot,
  arrayRemove
} from 'firebase/firestore'

export const dbAdapter = {
  getServerTimestamp: () => serverTimestamp(),
  createBatch: () => writeBatch(db),

  getDocRef: (path, ...segments) => doc(db, path, ...segments),
  getColRef: (path, ...segments) => collection(db, path, ...segments),

  add: async (colRef, data) => await addDoc(colRef, data),
  update: async (docRef, data) => await updateDoc(docRef, data),
  remove: async (docRef) => await deleteDoc(docRef),

  listen: (query, onNext, onError) => onSnapshot(query, onNext, onError),

  union: (...elements) => arrayUnion(...elements),
  removeFromArray: (...elements) => arrayRemove(...elements)
}
