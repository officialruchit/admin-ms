import { Request, Response } from 'express';
import { Product, IProduct } from '../../../model/product';

// Get all products
export const getAllProductsById = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const product = (await Product.findById(req.params.id)) as IProduct;
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
