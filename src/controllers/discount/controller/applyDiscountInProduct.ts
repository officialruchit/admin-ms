import { Request, Response } from 'express';
import { discount, IDiscount } from '../../../model/discount';
import { IProduct, Product } from '../../../model/product';
import mongoose from 'mongoose';

export const applyDiscount = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const discountId = req.params.discountId;
    const adminId = req.userId;

    // Check if adminId is present
    if (!adminId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Validate productId and discountId
    if (!productId || !discountId) {
      return res
        .status(400)
        .json({ message: 'Missing productId or discountId' });
    }

    // Check if discount exists
    const discountAvailability = (await discount.findById(
      discountId,
    )) as IDiscount;
    if (!discountAvailability) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Check if product exists
    const productAvailability = (await Product.findById(productId)) as IProduct;
    if (!productAvailability) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Determine the final discount percentage
    let finalDiscountPercentage = discountAvailability.percentage;

    if (productAvailability.discount) {
      const existingDiscount = await discount.findById(
        productAvailability.discount.toString(),
      );
      if (
        existingDiscount &&
        existingDiscount.percentage > finalDiscountPercentage
      ) {
        finalDiscountPercentage = existingDiscount.percentage;
      }
    }

    // Calculate the discounted price
    const originalPrice = productAvailability.price;
    const discountedPrice =
      originalPrice - (originalPrice * finalDiscountPercentage) / 100;

    // Update the product with the new discount
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        discount: new mongoose.Types.ObjectId(discountId), // Ensure ObjectId type
        discountedPrice: discountedPrice,
      },
      { new: true },
    )
      .populate('discount')
      .populate('category');

    if (!updatedProduct) {
      return res.status(500).json({ message: 'Failed to apply discount' });
    }

    res.status(200).json({
      message: 'Discount applied successfully',
      product: updatedProduct,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
