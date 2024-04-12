import mongoose from 'mongoose';

const connectio = {}

export async function connect() {
    if (connectio.isConnected) {
        console.log("already mongo db connected")
        return
    }
    try {
        const DB_OPTIONS = {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            authSource: process.env.DB_AUTHSOURCE
        }
        const db = await mongoose.connect(process.env.MONGO_DB_URI || '', DB_OPTIONS);
        connectio.isConnected = db.connections[0].readyState

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        process.exit()
    }
}
