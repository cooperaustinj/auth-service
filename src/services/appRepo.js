const db = require('./db');

module.exports = {
    async activeApplicationExists(appId) {
        return await db
            .select()
            .first()
            .from('client_application as ca')
            .innerJoin('client as c', 'ca.id', 'c.id')
            .where({
                'c.is_active': true,
                'ca.is_active': true,
                'ca.id': appId,
            });
    },
    async getApp(appId) {
        return await db('client_application').select().first().where({ id: appId });
    },
};
