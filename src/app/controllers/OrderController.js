import * as Yup from 'yup';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import User from '../models/User';
import File from '../models/File';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      recipient_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res
        .status(401)
        .json({ error: 'only administrator can create orders' });
    }

    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExists) {
      return res.status(404).json({ error: 'deliveryman not found' });
    }

    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(404).json({ error: 'recipient not found' });
    }

    const order = await Order.create(req.body);
    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'order not found' });
    }

    if (req.body.signature_id && req.body.signature_id !== order.signature_id) {
      const signatureFromAnotherOrder = await Order.findOne({
        where: { signature_id: req.body.signature_id },
      });

      if (signatureFromAnotherOrder) {
        return res.status(401).json({
          error: 'you cannot reuse the signature from another order',
        });
      }
    }

    if (req.body.signature_id) {
      if (!(await File.findByPk(req.body.signature_id))) {
        return res.status(404).json({ error: 'signature not found' });
      }
    }

    if (req.body.end_date && !req.body.signature_id) {
      return res.status(401).json({
        error: 'you cannot finish orders without a valid signature',
      });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
      start_date,
      end_date,
    } = await order.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
      start_date,
      end_date,
    });
  }
}

export default new OrderController();
