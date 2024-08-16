import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
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
    const id = req.params.id;

    // Destructure the fields to update from the request body
    const { name, description, products, discount } = req.body;

    // Validate that the admin is present
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }

    // Validate that the bundleId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bundle ID' });
    }

    // Validate that at least one field is provided for updating
    if (
      !name &&
      !description &&
      (!products || products.length === 0) &&
      discount === undefined
    ) {
      return res
        .status(400)
        .json({ message: 'At least one field must be provided to update' });
    }

    // If the discount is provided, validate it
    if (
      discount !== undefined &&
      (typeof discount !== 'number' || discount < 0 || discount > 100)
    ) {
      return res
        .status(400)
        .json({ message: 'Discount must be a number between 0 and 100' });
    }

    // If products are provided, validate the product IDs to ensure they are valid ObjectIds
    let productObjectIds;
    if (products && Array.isArray(products)) {
      productObjectIds = products.map((productId: string) => {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res
            .status(400)
            .json({ message: `Invalid product ID: ${productId}` });
        }
        return new mongoose.Types.ObjectId(productId);
      });
    }

    // Prepare the update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (products) updateData.products = productObjectIds;
    if (discount !== undefined) updateData.discount = discount;

    // Find and update the bundle product
    const updatedBundleProduct = await BundleProduct.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );

    // If the bundle product is not found, return a 404 error
    if (!updatedBundleProduct) {
      return res.status(404).json({ message: 'Bundle product not found' });
    }

    // Respond with the updated bundle product
    res.status(200).json({
      message: 'Bundle product updated successfully',
      bundleProduct: updatedBundleProduct,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
