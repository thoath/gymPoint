import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Contract from '../app/models/Contract';

const models = [User, Student, Contract];

/**
 * Iniciliza todos os models da api, conectano ao banco configurado
 * @author Lucas Koch
 */
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
