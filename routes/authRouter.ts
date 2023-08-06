import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  const foundUser = await User.findById(user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    res.json({ success: `User ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
export default router;
