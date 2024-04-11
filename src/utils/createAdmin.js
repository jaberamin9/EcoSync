import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/user';

connect();

async function checkAndCreateAdminUser() {

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
        await users.insertOne({ username: 'admin', email: 'admin@gmail.com', password: 'admin', role: 'System Admin' });
        console.log('Admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }
}

export { checkAndCreateAdminUser };
