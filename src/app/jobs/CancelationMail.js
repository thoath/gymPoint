import Mail from '../../lib/Mail';
import textProp from '../../utils/properties/textProperties';

class CancelationMail {
  get key() {
    return 'CancelationMail';
  }

  async handle({ data }) {
    const { contract, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: textProp.prop.get(
        'email.registration.cancelation.student.subject'
      ),
      template: 'cancelation',
      context: {
        title: contract.title,
        student: student.name,
      },
    });
  }
}

export default new CancelationMail();
