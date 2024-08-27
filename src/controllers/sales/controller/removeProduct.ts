import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';

export const removeProductFromSale = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { itemId } = req.body;

    // Find the sale
    const sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Remove the item from the sale
    sale.items = sale.items.filter((item) => item.itemId.toString() !== itemId);

    await sale.save();

    return res.status(200).json({ message: 'Item removed from sale', sale });
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ message: error.message });
  }
};
