import mongoose from 'mongoose';

export async function connect() {
    try {
        const DB_OPTIONS = {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            authSource: process.env.DB_AUTHSOURCE
        }
        await mongoose.connect(process.env.MONGO_DB_URI, DB_OPTIONS);

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        mongoose.connection.on('error', (err) => {
            console.log('MongoDB connection error.' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}
