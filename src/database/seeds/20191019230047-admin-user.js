const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@gympoint.com',
          phone: '(54) 996363288',
          provider: true,
          active: true,
          password_hash: bcrypt.hashSync('123456789', 7),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
