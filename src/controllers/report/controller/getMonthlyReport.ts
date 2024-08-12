import { Request, Response } from 'express';
import User from '../../../model/user';

export const getMonthlyLoginReportByRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const { year, month } = req.query;

    // Convert year and month to integers
    const targetYear = parseInt(year as string);
    const targetMonth = parseInt(month as string) - 1; // JavaScript months are 0-indexed

    // Get the first and last day of the target month
    const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

    const monthlyLogins = await User.aggregate([
      {
        $unwind: '$loginTimestamps',
      },
      {
        $match: {
          loginTimestamps: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
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
      data: monthlyLogins,
    });
  } catch (error) {
    console.error('Error generating monthly login report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
