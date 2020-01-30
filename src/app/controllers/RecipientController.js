import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street_name: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().notRequired(),
      state: Yup.string()
        .required()
        .min(2)
        .max(2),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    const {
      id,
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(400).json({ error: 'recipient not found' });
    }

    const {
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id: +id,
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();
