import Sequelize, { Model } from 'sequelize';
import * as Yup from 'yup';

/**
 * Modelo de planos de para alunos cadastrados
 * @author Lucas Koch
 */
class Contract extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.NUMBER,
        price: Sequelize.NUMBER,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );
  }

  /**
   * Valida a estrutura do requets json recebido
   * @returns boolean, true se o jSON e valido para a criacao de plano
   * @param {*} req request em JSON, usado para criar um plano
   */
  static isJsonCreateValid(req) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
      active: Yup.boolean().notRequired(),
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
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
      active: Yup.boolean(),
    });

    return schema.isValid(req.body);
  }
}

export default Contract;
