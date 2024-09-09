import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const salesReport = async (req: Request, res: Response) => {
  const { period } = req.params;

  if (!['daily', 'weekly', 'monthly'].includes(period)) {
    return res
      .status(400)
      .json({ message: 'Invalid period. Use daily, weekly, or monthly.' });
  }

  try {
    const now = new Date();
    let start: Date = new Date(),
      end: Date = new Date();

    // Determine the start and end dates for the specified period
    if (period === 'daily') {
      start = new Date(now.setHours(0, 0, 0, 0)); // Start of today
      end = new Date(now.setHours(23, 59, 59, 999)); // End of today
    } else if (period === 'weekly') {
      const currentDay = now.getDay();
      const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
      start = new Date(now.setDate(now.getDate() - daysToMonday)); // Start of the week (Monday)
      end = new Date(); // Current time (end of the week)
    } else if (period === 'monthly') {
      start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the month
    }

    // Generate sales report using aggregation
    const salesReport = await Order.aggregate([
      {
        $match: {
          status: 'delivered', // Only consider delivered orders
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null, // Group all orders together
          totalSales: { $sum: '$totalAmount' }, // Sum of all sales amounts
          totalOrders: { $sum: 1 }, // Count total number of orders
          totalProductsSold: { $sum: { $sum: '$items.quantity' } }, // Sum quantity of all items sold
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id
          totalSales: 1,
          totalOrders: 1,
          totalProductsSold: 1,
        },
      },
    ]);

    res.status(200).json(salesReport); // Send response with sales report
  } catch (error) {
    const err= error as Error
    res.status(500).json({ message: err.message });
  }
};
