import { Request, Response } from 'express';
import ProductCategory from '../model/ProductCategory'

export const deleteProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await ProductCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
