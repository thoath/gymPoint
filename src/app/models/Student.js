import Sequelize, { Model } from 'sequelize';
import * as Yup from 'yup';

/**
 * Modelo de estudantes da aplicacao, atualizacoes de colunas
 * devem ser feitas no arquivo de migracao
 * Atualizacoes de dados devem ser feitas apenas por usuarios administradadores
 * @author Lucas koch
 */
class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DOUBLE,
        height: Sequelize.DOUBLE,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );
  }

  /**
   * Valida a estrutura do requets json recebido
   * @returns boolean, true se o jSON e valido para a criacao de estudante
   * @param {*} req request em JSON, usado para criar um estudante
   */
  static isJsonCreateValid(req) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
      active: Yup.boolean().notRequired(),
    });

    return schema.isValid(req.body);
  }

  /**
   * Valida a estrutura do requets json recebido
   * @returns boolean, true se o jSON e valido para a atualizacao de estudante
   * @param {*} req request em JSON, usado para atualizar um estudante
   */
  static isJsonUpdateValid(req) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
      active: Yup.boolean(),
    });

    return schema.isValid(req.body);
  }
}

export default Student;
