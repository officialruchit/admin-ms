import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';

/**
 * Controller function to update an existing bundle product.
 *
 * @param req - Express Request object, containing the bundle product data and userId
 * @param res - Express Response object, used to send the response back to the client
 */
export const updateBundle = async (req: Request, res: Response) => {
  try {
    // Extract the sellerId from the request object (assuming it's set by middleware)
    const adminId = req.userId;

    // Extract the bundleId from the request parameters
    const bundleId = req.params.id;

    // Destructure the fields to update from the request body
    const { name, description, discountPercentage } = req.body;

     // Validate bundle ID
     if (!mongoose.Types.ObjectId.isValid(bundleId)) {
      return res.status(400).json({ message: 'Invalid bundle ID' });
    }

     // Find the existing bundle product
     const bundleProduct = await BundleProduct.findById(bundleId) as IBundleProduct;

     if (!bundleProduct) {
       return res.status(404).json({ message: 'Bundle product not found' });
     }
     
    // Update the name if provided
    if (name) {
      bundleProduct.name = name;
    }

    // Update the description if provided
    if (description) {
      bundleProduct.description = description;
    }

    // Update the discount percentage if provided and valid
    if (discountPercentage !== undefined) {
      if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
        return res.status(400).json({ message: 'Discount must be a number between 0 and 100' });
      }

      bundleProduct.discountPercentage = discountPercentage;

      // Calculate the discount price based on the updated discount percentage
      const totalOriginalPrice = bundleProduct.totalPrice ?? 0;
      bundleProduct.discountPrice = totalOriginalPrice * (1 - discountPercentage / 100);
    }

    // Save the updated bundle product
    await bundleProduct.save();

    // Respond with a success message and the updated bundle product
    res.status(200).json({ message: 'Bundle product updated', bundleProduct });
  
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
