import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';

// Add a product to a bundle
export const addProductToBundle = async (req: Request, res: Response) => {
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

    // Find the bundle to check if the product is already in the bundle
    const bundle = (await BundleProduct.findById(bundleId)) as IBundleProduct;
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    // Check if the product is already in the bundle
    const productObjectId = new mongoose.Types.ObjectId(productId);
    if (bundle.products.includes(productObjectId)) {
      return res
        .status(400)
        .json({ message: 'Product is already in the bundle' });
    }

    // Add the product to the bundle and set the adminId
    bundle.products.push(productObjectId);
    bundle.adminId = adminId; // Ensure adminId is set
    await bundle.save();

    // Populate the updated bundle with product details
    const updatedBundle =
      await BundleProduct.findById(bundleId).populate('products');

    res
      .status(200)
      .json({ message: 'Product added to bundle', bundle: updatedBundle });
  } catch (err) {
    const error = err as Error;
    console.error('Error adding product to bundle:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
