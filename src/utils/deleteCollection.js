import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  writeBatch
} from 'firebase/firestore'
import db from '@/db'

/**
 * Deletes all documents in a collection in batches.
 * This is an iterative process to avoid exceeding Firestore limits (500 ops per batch).
 * @param {import('firebase/firestore').CollectionReference} collectionRef - Reference to the collection to delete.
 * @param {number} batchSize - The size of the delete batch (max 500).
 */
export default async function deleteCollection(collectionRef, batchSize = 50) {
  let snapshot

  do {
    // get ext batch of documents.
    // the query is defined inside the loop to re-fetch the remaining documents
    const q = query(collectionRef, limit(batchSize))
    snapshot = await getDocs(q)

    if (snapshot.empty) break

    const batch = writeBatch(db)

    for (const d of snapshot.docs) {
      batch.delete(d.ref)
    }

    // Commit the batch deletion.
    await batch.commit()

    // The loop continues only if a full batch was deleted (meaning there might be more remaining).
  } while (snapshot.size >= batchSize)
}
