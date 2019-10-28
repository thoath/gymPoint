import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

/**
 * Modelo de usuarios administradores da aplicacao, atualizacoes de colunas
 * devem ser feitas no arquivo de migracao
 *
 * @author Lucas koch
 */
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 7);
      }
    });

    return this;
  }

  /**
   * Verifica a autonticidade do password informado
   * @param password senha ja cryptografada
   * @returns boolean, true se a senha e valida e igual a cadastrada
   */
  checkPwd(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  /**
   * Valida a estrutura do requets json enviado
   * @returns boolean, true se o jSON e valido para a criacao de usuario
   * @param {*} req request em JSON, usado para criar um usuario
   */
  static isValidCreateJson(req) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
      phone: Yup.string(),
    });

    return schema.isValid(req.body);
  }

  /**
   * Valida a estrutura do requets json enviado
   * @returns boolean, true se o jSON e valido para a solicitacao de login
   * @param {*} req request em JSON, usado para autenticar um usuario no sistema
   */
  static isValidLoginJson(req) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    return schema.isValid(req.body);
  }
}

export default User;
