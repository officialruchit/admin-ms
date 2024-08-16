import { Request, Response } from 'express';
import { Product } from '../../../model/product';

export const unblockProduct = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { blocked: false },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
