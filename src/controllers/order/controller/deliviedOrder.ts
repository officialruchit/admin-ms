import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const markOrderDelivered = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is already delivered
    if (order.status === 'delivered') {
      return res
        .status(400)
        .json({ message: 'Order is already marked as delivered' });
    }

    // Update the status to 'delivered'
    order.status = 'delivered';
    await order.save();

    res
      .status(200)
      .json({ message: 'Order marked as delivered successfully', order });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
