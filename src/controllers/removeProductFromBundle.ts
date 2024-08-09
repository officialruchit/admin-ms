import { Request, Response } from 'express';
import { BundleProduct } from '../model/bundle';
import mongoose from 'mongoose';

/**
 * Controller function to remove a product from a bundle.
 *
 * @param req - Express Request object, containing the bundleId and productId in the request parameters
 * @param res - Express Response object, used to send the response back to the client
 */
export const removeProductFromBundle = async (req: Request, res: Response) => {
  try {
    // Extract the bundleId and productId from the request parameters
    const { bundleId, productId } = req.params;

    // Ensure productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Update the bundle to remove the specified product
    const updatedBundle = await BundleProduct.findByIdAndUpdate(
      bundleId,
      { $pull: { products: productId } },
      { new: true },
    ).populate('products');

    // If no bundle is found, respond with status 404 (Not Found) and an error message
    if (!updatedBundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    // Respond with status 200 (OK) and return a success message along with the updated bundle
    res
      .status(200)
      .json({ message: 'Product removed from bundle', bundle: updatedBundle });
  } catch (err) {
    // If an error occurs, catch it and send a response with status 400 (Bad Request)
    // and include the error message
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
