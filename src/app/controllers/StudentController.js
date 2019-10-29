import Student from '../models/Student';
import textProp from '../../utils/properties/textProperties';

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
      return res
        .status(401)
        .json({ error: textProp.prop.get('json.request.invalid.parameters') });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (student) {
      return res
        .status(401)
        .json({ error: textProp.prop.get('student.validation.already.exist') });
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
      return res
        .status(401)
        .json({ error: textProp.prop.get('json.request.invalid.parameters') });
    }

    const { email } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (email && email !== student.email) {
      const studentExist = await Student.findOne({
        where: { email },
      });

      if (studentExist) {
        return res.status(401).json({
          error: textProp.prop.get('student.validation.already.exist'),
        });
      }
    }

    const { id, nome, active } = await student.update(req.body);

    return res.json({ id, nome, active });
  }
}

export default new StudentController();
