import { Request, Response } from 'express';
import ProductCategory from '../model/ProductCategory';

export const updateProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { name, description, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
