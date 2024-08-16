import { Request, Response } from 'express';
import { discount } from '../../../model/discount';

export const getByIdDiscount = async (req: Request, res: Response) => {
  try {
    const discountData = await discount.findById(req.params.id);
    res.status(200).json({
      discountData,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
