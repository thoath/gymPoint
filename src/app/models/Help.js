import Sequelize, { Model } from 'sequelize';
import * as Yup from 'yup';

/**
 * Modelo de usuarios administradores da aplicacao, atualizacoes de colunas
 * devem ser feitas no arquivo de migracao
 *
 * @author Lucas koch
 */
class Help extends Model {
  static init(sequelize) {
    super.init(
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }

  /**
   * Valida a estrutura do requets json enviado
   * @returns boolean, true se o jSON e valido para a criacao de usuario
   * @param {*} req request em JSON, usado para criar um usuario
   */
  static isValidCreateJson(req) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
      answer: Yup.string(),
    });

    return schema.isValid(req.body);
  }

  /**
   * Valida a estrutura do requets json enviado
   * @returns boolean, true se o jSON e valido para a criacao de usuario
   * @param {*} req request em JSON, usado para criar um usuario
   */
  static isValidUpdateJson(req) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    return schema.isValid(req.body);
  }
}

export default Help;
