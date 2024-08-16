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
    // Extract the sellerId from the request object (assuming it's set by middleware)
    const adminId = req.userId;

    // Destructure the required fields from the request body
    const { name, description, products, discount } = req.body;

    // Validate that the sellerId is present
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }

    // Validate that all required fields are provided
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one product is required' });
    }
    if (
      discount &&
      (typeof discount !== 'number' || discount < 0 || discount > 100)
    ) {
      return res
        .status(400)
        .json({ message: 'Discount must be a number between 0 and 100' });
    }

    // Validate product IDs to ensure they are valid ObjectIds
    const productObjectIds = products.map((productId: string) => {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(400)
          .json({ message: `Invalid product ID: ${productId}` });
      }
      return new mongoose.Types.ObjectId(productId);
    });

    // Create a new BundleProduct instance with the provided data
    const bundleProduct = new BundleProduct({
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
    res.status(500).json({ message: error.message });
  }
};
