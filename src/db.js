import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { app } from '@/firebase/firebase-config'

const db = initializeFirestore(app, { localCache: persistentLocalCache })
export default db
