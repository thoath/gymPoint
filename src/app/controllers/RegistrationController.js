import Intl from 'intl';
import Registration from '../models/Registration';
import Contract from '../models/Contract';
import Student from '../models/Student';
import textProp from '../../utils/properties/textProperties';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

/**
 * Controlador de matriculas dos alunos da academia
 * @author Lucas Koch
 */
class RegistrationController {
  /**
   * Cria uma matricula nova de um contrato ativo para um aluno
   * @param {*} req JSON com informacao de criacao da matricula
   * @param {*} res JSON resposta da operacao realizada
   */
  async store(req, res) {
    if (!(await Registration.isJsonCreateValid(req))) {
      return res.status(400).json({
        error: textProp.prop.get('json.request.invalid.parameters'),
      });
    }

    const { student_id, contract_id } = req.body;

    const registrationUserExist = await Registration.findOne({
      where: {
        student_id,
        canceled_at: null,
      },
    });

    if (registrationUserExist) {
      return res.status(401).json({
        error: textProp.prop.get('registration.validation.already.commited'),
      });
    }

    const contract = await Contract.findOne({
      where: { id: contract_id, active: true },
    });

    if (!contract) {
      return res.status(400).json({
        error: textProp.prop.get('contract.valitaion.not.found'),
      });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({
        error: textProp.prop.get('registration.validation.student.not.found'),
      });
    }

    const registration = await Registration.create(req.body);

    await Queue.add(RegistrationMail.key, {
      contract,
      student,
      registration,
    });

    return res.json(registration);
  }

  /**
   * Lista todas as matriculas dos alunos
   * @param {*} req JSON com filtros de listagem de matriculas
   * @param {*} res JSON resposta da operacao realizada
   */
  async index(req, res) {
    const registrations = await Registration.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: [
            'id',
            'name',
            'email',
            'age',
            'weight',
            'height',
            'active',
          ],
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'title', 'duration', 'price', 'active'],
        },
      ],
    });

    registrations.forEach(registration => {
      registration.price = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(registration.price);
      registration.contract.price = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(registration.contract.price);
    });

    return res.json(registrations);
  }

  /**
   * Atualiza uma matricula de um aluno
   * @param {*} req JSON com informacao de atualizacao de matricula
   * @param {*} res JSON resposta da operacao realizada
   */
  async update(req, res) {
    if (!(await Registration.isValidUpdateJson(req))) {
      return res
        .status(400)
        .json({ error: textProp.prop.get('json.request.invalid.parameters') });
    }

    const { contract_id, student_id } = req.body;

    if (contract_id) {
      const contractExist = await Contract.findOne({
        where: { id: contract_id, active: true },
      });

      if (!contractExist) {
        return res.status(400).json({
          error: textProp.prop.get('contract.valitaion.not.found'),
        });
      }
    }

    if (student_id) {
      const studentExist = await Student.findByPk(student_id);
      if (!studentExist) {
        return res.status(400).json({
          error: textProp.prop.get('registration.validation.student.not.found'),
        });
      }
    }

    const registration = await Registration.findByPk(req.params.id);
    const { start_date, end_date, price } = await registration.update(req.body);

    return res.json({
      start_date,
      end_date,
      price,
      student_id,
      contract_id,
    });
  }

  /**
   * Inativa uma matricula de um aluno
   * @param {*} req JSON com informacao de remocao de matricula
   * @param {*} res JSON resposta da operacao realizada
   */
  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration || registration.canceled_at) {
      return res.status(400).json({
        error: textProp.prop.get(
          'registration.validation.contract.already.exist'
        ),
      });
    }

    await registration.update({
      canceled_at: new Date(),
    });

    return res.json({ success: true });
  }
}

export default new RegistrationController();
