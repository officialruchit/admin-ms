import { Request, Response } from 'express';
import User from '../../../model/user';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const searchString = search as string;
    const filter = searchString
      ? { username: new RegExp(searchString, 'i') }
      : {};
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNumber);
    const users = await User.find(filter)
      .select('-password -twoFA.otp -twoFA.otpExpiry')
      .populate({ path: 'username' })
      .populate('profile')
      .populate('roles')
      .populate('twoFA')
      .limit(limitNumber);
    res
      .status(200)
      .json({ totalUsers, totalPages, currentPage: pageNumber, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
