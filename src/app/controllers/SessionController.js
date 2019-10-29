import jwt from 'jsonwebtoken';
import User from '../models/User';
import auth from '../../config/auth';
import textProp from '../../utils/properties/textProperties';

/**
 * Controlador de sessao, utilizado apenas para usuario administradores
 * Login nao deve ser implementado para estudantes
 *
 * Bearer token utilizado como solucao de autenticacao
 * @author Lucas Koch
 */
class SessionController {
  /**
   * Autentica um usuario admin no sistema
   * @param {*} req JSON de solicitacao der login
   * @param {*} res JSON com informacoes do usuario logado
   */
  async store(req, res) {
    if (!(await User.isValidLoginJson(req))) {
      res.status(401).json({
        error: textProp.prop.get('json.request.invalid.parameters'),
      });
    }

    const { email, password } = req.body;

    const userExist = await User.findOne({
      where: {
        email,
      },
    });

    if (!userExist || !(await userExist.checkPwd(password))) {
      return res.status(401).json({
        error: textProp.prop.get('login.validation.invalid.credentials'),
      });
    }

    const { id, name, provider } = userExist;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id, userIsProvider: provider }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
