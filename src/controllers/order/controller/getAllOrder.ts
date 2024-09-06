import { Request, Response } from 'express';
import { Order } from '../../../model/order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Find all orders for the user
    const orders = await Order.find({ userId }).populate('orderItems');

    res.status(200).json({ orders });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
};
