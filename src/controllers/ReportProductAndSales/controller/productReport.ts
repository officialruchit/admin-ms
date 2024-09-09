import { Request, Response } from 'express';
import { Order } from '../../../model/order';


export const topSellingProducts = async (req: Request, res: Response) => {
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

    // Generate report for top-selling products using aggregation
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'delivered', // Only consider delivered orders
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $unwind: '$orderItems', // Unwind orderItems array to aggregate each item
      },
      {
        $group: {
          _id: '$orderItems.itemId', // Group by productId (orderItems.itemId)
          totalQuantitySold: { $sum: '$orderItems.quantity' }, // Sum total quantity sold per product
          totalRevenue: {
            $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] },
          }, // Calculate total revenue
        },
      },
      {
        $lookup: {
          from: 'products', // Reference the product collection
          localField: '_id', // Match productId with _id from product collection
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails', // Unwind the product details array
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$productDetails.name',
          totalQuantitySold: 1,
          totalRevenue: 1,
          price: '$productDetails.price',
        },
      },
      {
        $sort: { totalQuantitySold: -1 }, // Sort by totalQuantitySold in descending order
      },
      {
        $limit: 10, // Limit to top 10 selling products
      },
    ]);

    res.status(200).json(topProducts); // Send response with top-selling products report
  } catch (error) {
    const err= error as Error
    res.status(500).json({ message: err.message });
  }
};
