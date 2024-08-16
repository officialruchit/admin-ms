import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';

export const unblockBundleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    const bundleProduct = (await BundleProduct.findById(id)) as IBundleProduct;
    if (!bundleProduct) {
      return res.status(404).json({ message: 'Bundle Product not found' });
    }
    bundleProduct.blocked = false;
    await bundleProduct.save();
    res.status(200).json({ message: 'Bundle Product unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
