import { Request, Response } from 'express';
import { discount } from '../../../model/discount';

export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const discounts = await discount.findByIdAndUpdate(id, data, { new: true });
    if (!discounts) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json({ message: 'Discount update', discount: discounts });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
