import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
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
