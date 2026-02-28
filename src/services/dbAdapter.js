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
  setDoc,
  onSnapshot,
  arrayRemove,
  query,
  collectionGroup,
  where,
  getDocs,
  documentId,
  getDoc
} from 'firebase/firestore'

const getFilters = (filters) => filters?.map(filter => where(...filter))

export const dbAdapter = {
  getServerTimestamp: () => serverTimestamp(),
  createBatch: () => writeBatch(db),
  documentId: () => documentId(),

  getDocRef: (path, ...segments) => {
    if (typeof path === 'string') {
      return doc(db, path, ...segments)
    }
    return doc(path, ...segments)
  },
  getColRef: (path, ...segments) => {
    if (typeof path === 'string') {
      return collection(db, path, ...segments)
    }
    return collection(path, ...segments)
  },

  getQuery: (q, ...filters) => query(q, ...getFilters(filters)),
  getGroupQuery: (q, ...filters) => query(collectionGroup(db, q), ...getFilters(filters)),
  getDocs: (col) => getDocs(col),
  getDoc: (doc) => getDoc(doc),

  add: async (colRef, data) => await addDoc(colRef, data),
  update: async (docRef, data) => await updateDoc(docRef, data),
  set: async (docRef, data) => await setDoc(docRef, data),
  remove: async (docRef) => await deleteDoc(docRef),

  listen: (query, onNext, onError) => onSnapshot(query, onNext, onError),

  union: (...elements) => arrayUnion(...elements),
  removeFromArray: (...elements) => arrayRemove(...elements),

  deleteCollection: async (collectionRef, batchSize = 50) => {
    let snapshot

    do {
      // use internal getQuery with limit
      const q = query(collectionRef, limit(batchSize))
      snapshot = await getDocs(q)

      if (snapshot.empty) break

      const batch = writeBatch(db)

      for (const d of snapshot.docs) {
        batch.delete(d.ref)
      }

      await batch.commit()

      // continue if there might be more documents
    } while (snapshot.size >= batchSize)
  }
}
