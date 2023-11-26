import mongoose from 'mongoose';

export async function clearMongoCollections() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.deleteMany({});
        } catch (err) {
            console.log(`Ошибка при очистке коллекции ${collectionName}:`, (err as Error).message);
        }
    }
}
