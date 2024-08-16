import { Request, Response } from 'express';
import User from '../../../model/user';

export const getDailyLoginReportByRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyLogins = await User.aggregate([
      {
        $unwind: '$loginTimestamps',
      },
      {
        $match: {
          loginTimestamps: {
            $gte: today,
          },
        },
      },
      {
        $unwind: '$roles',
      },
      {
        $group: {
          _id: '$roles',
          totalLogins: { $sum: 1 },
          users: { $addToSet: '$_id' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: dailyLogins,
    });
  } catch (error) {
    console.error('Error generating daily login report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
