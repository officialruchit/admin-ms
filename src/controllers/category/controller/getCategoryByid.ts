import { Request, Response } from 'express';
import ProductCategory from '../../../model/ProductCategory';

export const getProductCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
