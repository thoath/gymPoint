import Sequelize, { Model } from 'sequelize';
import { addMonths } from 'date-fns';
import * as Yup from 'yup';
import Contract from './Contract';

/**
 * Modelo de planos de para alunos cadastrados
 * @author Lucas Koch
 */
class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        price: Sequelize.NUMBER,
        end_date: Sequelize.DATE,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async register => {
      const { duration, price } = await Contract.findByPk(register.contract_id);
      register.end_date = addMonths(register.start_date, duration);
      register.price = price * duration;
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Contract, {
      foreignKey: 'contract_id',
      as: 'contract',
    });
  }

  /**
   * Valida a estrutura do requets json recebido
   * @returns boolean, true se o jSON e valido para a criacao de plano
   * @param {*} req request em JSON, usado para criar um plano
   */
  static isJsonCreateValid(req) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.string().required(),
      contract_id: Yup.string().required(),
    });

    return schema.isValid(req.body);
  }

  /**
   * Valida a estrutura do requets json enviado
   * @returns boolean, true se o jSON e valido para a atualizacao de plano
   * @param {*} req request em JSON, usado para atualizar um plano
   */
  static isValidUpdateJson(req) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.string().required(),
      contract_id: Yup.string().required(),
    });

    return schema.isValid(req.body);
  }
}

export default Registration;
