import { Request, Response } from 'express';
import { discount } from '../model/discount';

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discounts = await discount.findById(id);
    if (!discounts) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json({ message: 'Discount deleted', discount: discounts });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
