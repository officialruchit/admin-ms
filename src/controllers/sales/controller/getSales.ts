import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';
import ProductCategory from '../../../model/ProductCategory';

export const getSaleDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Find the sale
    const sale = await Sales.findById(id).populate({
      path: 'items.itemId',
      select: 'name description price', // Select specific fields from itemId
      populate: {
        path: 'category',
        model: ProductCategory, // Ensure the correct model is referenced
        select: 'name description', // Select specific fields from category
      },
    });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    return res.status(200).json({ sale });
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ message: error.message });
  }
};
