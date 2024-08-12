import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';

/**
 * Controller function to delete a bundle product.
 *
 * @param req - Express Request object, containing the bundleId in the request parameters
 * @param res - Express Response object, used to send the response back to the client
 */
export const deleteBundleProduct = async (req: Request, res: Response) => {
  try {
    // Extract the bundleId from the request parameters
    const { bundleId } = req.params;

    // Find the bundle product by its ID and delete it
    const deletedBundle = await BundleProduct.findByIdAndDelete(bundleId);

    // If no bundle is found, respond with status 404 (Not Found) and an error message
    if (!deletedBundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    // Respond with status 200 (OK) and return a success message along with the deleted bundle
    res
      .status(200)
      .json({ message: 'Bundle deleted successfully', bundle: deletedBundle });
  } catch (err) {
    // If an error occurs, catch it and send a response with status 500 (Internal Server Error)
    // and include the error message
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
