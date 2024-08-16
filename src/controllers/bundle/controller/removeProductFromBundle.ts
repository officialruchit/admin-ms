import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';

// Remove a product from a bundle
export const removeProductFromBundle = async (req: Request, res: Response) => {
  try {
    const { bundleId, productId } = req.params;
    const adminId = req.userId;

    // Ensure bundleId and productId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({ message: 'Invalid bundle ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Validate that the adminId is present
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }

    // Find the bundle to check if it exists
    const bundle = (await BundleProduct.findById(bundleId)) as IBundleProduct;
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    // Check if the product is in the bundle
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const productIndex = bundle.products.indexOf(productObjectId);

    if (productIndex === -1) {
      return res.status(400).json({ message: 'Product is not in the bundle' });
    }

    // Remove the product from the bundle
    bundle.products.splice(productIndex, 1);

    // Ensure adminId is set (if needed)
    bundle.adminId = adminId;

    await bundle.save();

    // Populate the updated bundle with product details
    const updatedBundle =
      await BundleProduct.findById(bundleId).populate('products');

    res
      .status(200)
      .json({ message: 'Product removed from bundle', bundle: updatedBundle });
  } catch (err) {
    const error = err as Error;
    console.error('Error removing product from bundle:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
