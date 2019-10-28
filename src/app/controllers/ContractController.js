import Contract from '../models/Contract';

/**
 * Controlador para operacoes de planos para alunos
 * @author Lucas Koch
 */
class ContractController {
  async index(req, res) {
    const contracts = await Contract.findAll({
      attributes: ['title', 'duration', 'price', 'active'],
    });

    return res.json(contracts);
  }

  async store(req, res) {
    if (!(await Contract.isJsonCreateValid(req))) {
      return res.status(401).json({ error: 'Parâmetros inválidos.' });
    }

    const contractExist = await Contract.findOne({
      where: {
        title: req.body.title,
      },
    });

    if (contractExist) {
      return res
        .status(401)
        .json({ error: 'Contrato já existe com esse titulo.' });
    }

    const { id, title, duration, price, active } = await Contract.create(
      req.body
    );

    return res.json({
      id,
      title,
      duration,
      price,
      active,
    });
  }

  async update(req, res) {
    if (!(await Contract.isValidUpdateJson(req))) {
      return res.status(401).json({ error: 'Parâmetros inválidos.' });
    }

    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(400).json({ error: 'Contrato não encontrado.' });
    }

    const { title } = req.body;

    if (title) {
      const contractExist = await Contract.findOne({
        where: {
          title: req.body.title,
        },
      });

      if (contractExist) {
        return res
          .status(401)
          .json({ error: 'Contrato já existe com esse titulo.' });
      }
    }

    const { duration, price, active } = await contract.update(req.body);

    return res.json({
      title,
      duration,
      price,
      active,
    });
  }

  async delete(req, res) {
    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(400).json({ error: 'Contrato não encontrado.' });
    }

    await contract.destroy();

    return res.json({ success: true });
  }
}

export default new ContractController();
