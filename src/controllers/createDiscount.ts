import { discount } from '../model/discount';
import { Request, Response } from 'express';
export const createDiscount = async (req: Request, res: Response) => {
  try {
    const { discountId, percentage, description, validFrom, validTo } =
      req.body;
    // if (!sellerId) {
    //   res.status(404).json({ message: 'invalid seller is not present' });
    // }
    if (!discountId || !validFrom || !validTo || !description || !percentage) {
      res.status(404).json({ message: "discount's data is missing" });
    }
    const newDiscount = new discount({
      discountId,
      percentage,
      description,
      validFrom,
      validTo,
      // sellerId,
    });
    const data = await newDiscount.save();
    res.status(201).json({ message: data });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
