import { Request, Response } from 'express';
import User from '../model/user';

export const getYearlyLoginReportByRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const yearlyLogins = await User.aggregate([
      {
        $unwind: '$loginTtimestamps',
      },
      {
        $match: {
          loginTimestamps: {
            $gte: firstDayOfYear,
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
      data: yearlyLogins,
    });
  } catch (error) {
    console.error('Error generating yearly login report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
