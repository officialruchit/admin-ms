import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { discount as Discount } from '../../../model/discount';
import { Product } from '../../../model/product';

export const addProductToDiscount = async (req: Request, res: Response) => {
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

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if the product is already added to the discount
    if (discount.productIds && discount.productIds.includes(productId)) {
      return res
        .status(400)
        .json({ message: 'Product already added to discount.' });
    }

    // Add the product ID to the discount's productIds array
    discount.productIds = discount.productIds || [];
    discount.productIds.push(productId);

    // Save the discount
    await discount.save();

    res
      .status(200)
      .json({ message: 'Product added to discount successfully.', discount });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
