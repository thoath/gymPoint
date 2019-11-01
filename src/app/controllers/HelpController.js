import Help from '../models/Help';
import textProp from '../../utils/properties/textProperties';
import Student from '../models/Student';

class HelpController {
  async store(req, res) {
    if (!(await Help.isValidCreateJson(req))) {
      return res
        .status(400)
        .json({ error: textProp.prop.get('json.request.invalid.parameters') });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(400).json({
        success: false,
        error: textProp.prop.get('registration.validation.student.not.found'),
      });
    }

    try {
      const { question } = req.body;
      await Help.create({
        student_id: req.params.id,
        question,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: textProp.prop.get('json.request.generic.error'),
      });
    }

    return res.json({ success: true });
  }

  async update(req, res) {
    if (!Help.isValidUpdateJson(req)) {
      res.status(400).json({
        success: false,
        error: textProp.prop.get('json.request.invalid.parameters'),
      });
    }

    const help = await Help.findByPk(req.params.id);

    if (!help) {
      res.status(400).json({
        success: false,
        error: textProp.prop.get('help.not.found'),
      });
    }

    const { answer } = req.body;

    await help.update({ answer, answer_at: new Date() });

    return res.json({ success: true });
  }
}

export default new HelpController();
