import Registration from '../models/Registration';
import Contract from '../models/Contract';
import Student from '../models/Student';
import textProp from '../../utils/properties/textProperties';

class RegistrationController {
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

    const contractExist = await Contract.findOne({
      where: { id: contract_id, active: true },
    });

    if (!contractExist) {
      return res.status(400).json({
        error: textProp.prop.get(
          'registration.validation.contract.already.exist'
        ),
      });
    }

    const registration = await Registration.create(req.body);

    return res.json(registration);
  }

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

    return res.json(registrations);
  }

  async update(req, res) {
    if (!(await Registration.isValidUpdateJson(req))) {
      return res
        .status(400)
        .json({ error: textProp.prop.get('json.request.invalid.parameters') });
    }

    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new RegistrationController();
