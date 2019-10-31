import { subDays, parseISO, isValid, isAfter } from 'date-fns';
import Checkin from '../schemas/Checkin';
import Student from '../models/Student';
import textProp from '../../utils/properties/textProperties';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        error: textProp.prop.get('registration.validation.student.not.found'),
      });
    }

    const today = new Date();
    const fromDay = subDays(today, 7);

    const checkinCount = await Checkin.count({
      student: id,
      createdAt: {
        $gt: fromDay,
        $lt: today,
      },
    });

    if (checkinCount && checkinCount >= 5) {
      return res
        .status(401)
        .json({ error: textProp.prop.get('checkin.max.allowed') });
    }

    await Checkin.create({
      student: id,
    });

    return res.json({ success: true, id });
  }

  async index(req, res) {
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        error: textProp.prop.get('registration.validation.student.not.found'),
      });
    }

    const from = parseISO(start_date || subDays(new Date(), 1).toISOString());
    const to = parseISO(end_date || new Date().toISOString());

    if (!isValid(from) || !isValid(to) || isAfter(from, to)) {
      return res
        .status(400)
        .json({ error: textProp.prop.get('checkin.date.invalid') });
    }

    const checkins = await Checkin.find({
      student: id,
      createdAt: {
        $gt: from,
        $lt: to,
      },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
