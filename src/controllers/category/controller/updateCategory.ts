import { Request, Response } from 'express';
import ProductCategory from '../../../model/ProductCategory';
import mongoose from 'mongoose';

export const updateProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID format.' });
    }

    // Validate name
    if (name && (typeof name !== 'string' || name.trim() === '')) {
      return res
        .status(400)
        .json({ message: 'Name must be a non-empty string.' });
    }

    // Validate description
    if (description && typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string.' });
    }

    // Check if a category with the same name already exists (excluding the current category)
    if (name) {
      const existingCategory = await ProductCategory.findOne({
        name: name.trim(),
        _id: { $ne: id }, // Exclude the current category from the check
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ message: 'A category with this name already exists.' });
      }
    }

    // Update the category
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { name: name?.trim(), description, updatedAt: new Date() },
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
