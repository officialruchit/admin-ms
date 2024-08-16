import { Request, Response } from 'express';
import User from '../../../model/user';

export const blockUser = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User blocked successfully', user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
