import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const markOrderShipped = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status to 'shipped'
    order.status = 'shipped';
    await order.save();

    res
      .status(200)
      .json({ message: 'Order marked as shipped successfully', order });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
