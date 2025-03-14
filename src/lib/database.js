const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.DB_NAME || 'symol_db';

let client;
let db;

// Connect to MongoDB once and reuse the connection
async function connect() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to MongoDB: ${dbName}`);
    }
    return db;
}

// Get a collection (automatically ensures the connection is established)
async function getCollection(collectionName) {
    const database = await connect();
    return database.collection(collectionName);
}

// Insert a document
async function insertDocument(collectionName, document) {
    try {
        const collection = await getCollection(collectionName);
        const result = await collection.insertOne(document);
        return result;
    } catch (err) {
        console.error('Failed to insert document', err);
    }
}

// Find documents
async function findDocuments(collectionName, query = {}) {
    try {
        const collection = await getCollection(collectionName);
        const documents = await collection.find(query).toArray();
        return documents;
    } catch (err) {
        console.error('Failed to find documents', err);
    }
}

// Update a document
async function updateDocument(collectionName, query, update) {
    try {
        const collection = await getCollection(collectionName);
        const result = await collection.updateOne(query, { $set: update });
        return result;
    } catch (err) {
        console.error('Failed to update document', err);
    }
}

// Delete a document
async function deleteDocument(collectionName, query) {
    try {
        const collection = await getCollection(collectionName);
        const result = await collection.deleteOne(query);
        return result;
    } catch (err) {
        console.error('Failed to delete document', err);
    }
}

// Close the MongoDB connection
async function closeConnection() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
        client = null;
    }
}

module.exports = {
    connect,
    insertDocument,
    findDocuments,
    updateDocument,
    deleteDocument,
    closeConnection
};
