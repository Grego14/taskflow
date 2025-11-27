import { app } from '@/firebase/firebase-config'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const db = initializeFirestore(app, { localCache: persistentLocalCache })
export default db
