import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';

/**
 * Controller function to create a new bundle product.
 *
 * @param req - Express Request object, containing the bundle product data and userId
 * @param res - Express Response object, used to send the response back to the client
 */
export const createBundleProduct = async (req: Request, res: Response) => {
  try {
    // Extract the admin from the request object (assuming it's set by middleware)
    const adminId = req.userId;

    // Destructure the required fields from the request body
    const { bundleId, name, description, products, discount } = req.body;

    // Convert product IDs from strings to ObjectIds
    const productObjectIds = products.map(
      (productId: string) => new mongoose.Types.ObjectId(productId),
    );

    // Create a new BundleProduct instance with the provided data
    const bundleProduct = new BundleProduct({
      bundleId,
      adminId,
      name,
      description,
      products: productObjectIds,
      discount,
    });

    // Save the new bundle product to the database
    await bundleProduct.save();

    // Respond with status 201 (Created) and return a success message along with the created bundle product
    res.status(201).json({ message: 'Bundle product created', bundleProduct });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
