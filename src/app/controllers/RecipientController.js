import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
