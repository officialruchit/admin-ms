import { Request, Response } from 'express';
import { discount, IDiscount } from '../../../model/discount';
import { IProduct, Product } from '../../../model/product';

export const applyDiscount = async (req: Request, res: Response) => {
  try {
    const { productId, discountId } = req.params;
    const adminId = req.userId;

    if (!adminId) {
      return res.status(404).json({ message: 'Invalid seller' });
    }

    if (!productId) {
      return res.status(404).json({ message: 'Missing productId' });
    }

    const discountAvailability = (await discount.findById(
      discountId,
    )) as IDiscount;
    if (!discountAvailability) {
      return res.status(400).json({ message: 'Discount not found' });
    }

    const productAvailability = (await Product.findById(productId)) as IProduct;
    if (!productAvailability) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Get the existing discount and compare it with the new one
    const existingDiscountId = productAvailability.discountedPrice;
    let finalDiscountPercentage = discountAvailability.percentage;

    if (existingDiscountId) {
      const existingDiscount = await discount.findById(existingDiscountId);
      if (
        existingDiscount &&
        existingDiscount.percentage > discountAvailability.percentage
      ) {
        finalDiscountPercentage = existingDiscount.percentage;
      }
    }

    const originalPrice = productAvailability.price;
    const discountedPrice =
      originalPrice - (originalPrice * finalDiscountPercentage) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        discount: discountId,
        discountedPrice: discountedPrice,
      },
      { new: true },
    )
      .populate('discount')
      .populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res
      .status(201)
      .json({ message: 'Discount applied', product: updatedProduct });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
