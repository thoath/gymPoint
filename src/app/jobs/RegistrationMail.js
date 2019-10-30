import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Intl from 'intl';
import Mail from '../../lib/Mail';
import textProp from '../../utils/properties/textProperties';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { contract, student, registration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}`,
      subject: textProp.prop.get('email.registration.student.subject'),
      template: 'registration',
      context: {
        title: contract.title,
        student: student.name,
        duration: `${contract.duration} meses.`,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(registration.price),
        start_date: format(parseISO(registration.start_date), "dd 'de' MMMM'", {
          locale: pt,
        }),
        end_date: format(parseISO(registration.end_date), "dd 'de' MMMM'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new RegistrationMail();
