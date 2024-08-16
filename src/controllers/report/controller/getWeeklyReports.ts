import { Request, Response } from 'express';
import User from '../../../model/user';

export const getWeeklyLoginReportByRole = async (
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
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const weeklyLogins = await User.aggregate([
      {
        $unwind: '$loginTimestamps',
      },
      {
        $match: {
          loginTimestamps: {
            $gte: lastWeek,
          },
        },
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
      data: weeklyLogins,
    });
  } catch (error) {
    console.error('Error generating weekly login report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
