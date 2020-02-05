import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import User from '../models/User';

class DeliverymanController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Only authorized users can list Deliverymen' });
    }

    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Only authorized users can register Deliverymen' });
    }

    const { email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman already registered' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Only authorized users can register Deliverymen' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    if (req.body.email && req.body.email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email: req.body.email },
      });

      if (deliverymanExists) {
        return res.status(401).json({ error: 'Email already registered' });
      }
    }

    const { id, name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Only authorized users can delete Deliverymen' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();
    return res.json();
  }
}

export default new DeliverymanController();
