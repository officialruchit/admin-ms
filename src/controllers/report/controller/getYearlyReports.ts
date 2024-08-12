import { Request, Response } from 'express';
import User from '../../../model/user';

export const getLoginReportByRole = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    // Convert year and month to integers
    const targetYear = parseInt(year as string);

    let startDate: Date, endDate: Date;

    if (month) {
      const targetMonth = parseInt(month as string) - 1; // JavaScript months are 0-indexed

      // Get the first and last day of the target month
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0);
    } else {
      // Get the first and last day of the target year
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31);
    }

    const logins = await User.aggregate([
      {
        $unwind: '$loginTimestamps',
      },
      {
        $match: {
          loginTimestamps: {
            $gte: startDate,
            $lte: endDate,
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
      data: logins,
    });
  } catch (error) {
    console.error('Error generating login report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
