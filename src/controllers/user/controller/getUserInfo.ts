import { Request, Response } from 'express';
import User from '../../../model/user';

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
