const db = require('./db');

module.exports = {
    async insertUser(appId, { firstName, lastName, email, hashedPassword, isActive }) {
        return await db('application_user')
            .insert({
                application_id: appId,
                first_name: firstName,
                last_name: lastName,
                email: email,
                hashed_password: hashedPassword,
                is_active: isActive,
            })
            .returning('id');
    },
    async getUser(appId, email) {
        return await db('application_user').select().first().where({ application_id: appId, email: email });
    },
};
