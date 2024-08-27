import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { discount as Discount } from '../../../model/discount';

export const removeProductFromDiscount = async (
  req: Request,
  res: Response,
) => {
  try {
    const { discountId } = req.params;
    const { productId } = req.body;

    // Validate that discountId and productId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(discountId)) {
      return res.status(400).json({ message: 'Invalid discount ID.' });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    // Check if the discount exists
    const discount = await Discount.findById(discountId);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found.' });
    }

    // Check if the product is in the discount
    if (!discount.productIds || !discount.productIds.includes(productId)) {
      return res
        .status(400)
        .json({ message: 'Product not found in discount.' });
    }

    // Remove the product ID from the discount's productIds array
    discount.productIds = discount.productIds.filter(
      (id) => id.toString() !== productId,
    );

    // Save the discount
    await discount.save();

    res
      .status(200)
      .json({
        message: 'Product removed from discount successfully.',
        discount,
      });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
