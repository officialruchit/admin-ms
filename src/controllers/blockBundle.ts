import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../model/bundle';

export const blockBundleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bundleProduct = (await BundleProduct.findById(id)) as IBundleProduct;
    if (!bundleProduct) {
      return res.status(404).json({ message: 'Bundle Product not found' });
    }
    bundleProduct.blocked = true;
    await bundleProduct.save();
    res.status(200).json({ message: 'Bundle Product blocked successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
