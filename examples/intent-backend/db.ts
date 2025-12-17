import { Collection, type Db, MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/motia_local'
let client: MongoClient
let dbInstance: Db

// Lazily connect to MongoDB
async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance

  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    console.log('Connected to MongoDB')
  }

  dbInstance = client.db()
  return dbInstance
}

// Proxy to allow db.collection('name') syntax in steps
export const db = {
  collection: (name: string) => {
    return {
      find: (query: any) => ({
        limit: (n: number) => ({
          toArray: async () => {
            const d = await getDb()
            return d.collection(name).find(query).limit(n).toArray()
          },
        }),
        toArray: async () => {
          const d = await getDb()
          return d.collection(name).find(query).toArray()
        },
      }),
      findOne: async (query: any) => {
        const d = await getDb()
        return d.collection(name).findOne(query)
      },
      insertOne: async (doc: any) => {
        const d = await getDb()
        return d.collection(name).insertOne(doc)
      },
    }
  },
}
