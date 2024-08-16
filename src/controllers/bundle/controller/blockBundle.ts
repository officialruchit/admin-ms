import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';

export const blockBundleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const adminId = req.userId; // Assuming req.userId is set correctly from middleware
    console.log(adminId);
    // Check if adminId is present
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }

    // Find the bundle product by ID
    const bundleProduct = (await BundleProduct.findById(id)) as IBundleProduct;
    console.log(bundleProduct);
    // Check if the bundle product exists
    if (!bundleProduct) {
      return res.status(404).json({ message: 'Bundle Product not found' });
    }

    // Block the bundle product
    bundleProduct.blocked = true;

    // Save the changes
    await bundleProduct.save();

    res.status(200).json({ message: 'Bundle Product blocked successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
