import User from '../models/User';

/**
 * Controlador das regras de usuarios admin do sistema
 * Usuarios que se autenticam no sistema
 * @author Lucas Koch
 */
class UserController {
  /**
   * Cria um novo usuario admin no sistema
   * @param {*} req JSON com informacao de criacao do usuario
   * @param {*} res JSON resposta da operacao realizada
   */
  async store(req, res) {
    if (!(await User.isValidCreateJson(req))) {
      return res.status(401).json({ error: 'Parâmetros inválidos.' });
    }

    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExist) {
      return res
        .status(401)
        .json({ error: 'Usuário ja existe com esse e-mail.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    return res.json();
  }
}

export default new UserController();
