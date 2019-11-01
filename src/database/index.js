import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Contract from '../app/models/Contract';
import Registration from '../app/models/Registration';
import Help from '../app/models/Help';

const models = [User, Student, Contract, Registration, Help];

/**
 * Iniciliza todos os models da api, conectano ao banco configurado
 * @author Lucas Koch
 */
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
