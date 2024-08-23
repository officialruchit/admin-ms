import { Request, Response } from 'express';
import { IProduct, Product } from '../../../model/product';
import { IDiscount, discount } from '../../../model/discount';
import mongoose from 'mongoose';

export const removeDiscount = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const adminId = req.userId;

    // Check if adminId is present
    if (!adminId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check if the product exists
    const product = (await Product.findById(productId)) as IProduct;
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product has no discount, return a message
    if (!product.discount) {
      return res
        .status(400)
        .json({ message: 'No discount applied to this product' });
    }

    // Remove the discount from the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        discount: null, // Remove the discount
        discountedPrice: product.price, // Reset discounted price to original price
      },
      { new: true },
    )
      .populate('discount')
      .populate('category');

    if (!updatedProduct) {
      return res.status(500).json({ message: 'Failed to remove discount' });
    }

    res.status(200).json({
      message: 'Discount removed successfully',
      product: updatedProduct,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
