import Student from '../models/Student';

/**
 * Controlador das regras de negocio para estudantes
 * @author Lucas Koch
 */
class StudentController {
  /**
   * Metodo de criacao de um novo usuario
   * @returns JSON com informacoes do usuario criado no banco
   * @param {*} req JSON com a estrutura de criacao de um usuario
   * @param {*} res JSON de resposta para o cliente (id, name, email, active)
   */
  async store(req, res) {
    if (!(await Student.isJsonCreateValid(req))) {
      return res.status(401).json({ error: 'Parâmetros inválidos.' });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (student) {
      return res
        .status(401)
        .json({ error: 'Estudante ja existe com esse e-mail.' });
    }

    const { id, name, email, active } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      active,
    });
  }

  /**
   * Metodo de atualizacao de um usuario existente no sistema
   * @returns JSON com informacoes do usuario atualizado no banco
   * @param {*} req JSON com a estrutura de atualizacao de um usuario
   * @param {*} res JSON de resposta para o cliente (id, name, active)
   */
  async update(req, res) {
    if (!(await Student.isJsonUpdateValid(req))) {
      return res.status(401).json({ error: 'Parâmetros inválidos.' });
    }

    const { email } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (email && email !== student.email) {
      const studentExist = await Student.findOne({
        where: { email },
      });

      if (studentExist) {
        return res
          .status(401)
          .json({ error: 'Estudante já existe com esse email.' });
      }
    }

    const { id, nome, active } = await student.update(req.body);

    return res.json({ id, nome, active });
  }
}

export default new StudentController();
