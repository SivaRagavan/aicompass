// @ts-nocheck
import { MongoClient } from 'mongodb'
import { env } from './env'

const client = new MongoClient(env.MONGODB_URI)

export const dbPromise = client.connect().then((connection: MongoClient) => connection.db())
