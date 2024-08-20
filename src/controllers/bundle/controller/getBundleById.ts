import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';

// Get a bundle by ID
export const getBundleById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const adminId = req.userId;
    // Ensure bundleId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bundle ID' });
    }
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    // Find the bundle by ID and populate associated products
    const bundle = await BundleProduct.findById(id).populate({
      path: 'products',
      select: 'name description price quantity',
    });
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    res.status(200).json({ message: 'Bundle found', bundle });
  } catch (err) {
    const error = err as Error;
    console.error('Error retrieving bundle:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
