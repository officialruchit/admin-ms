import { Request, Response } from 'express';
import ProductCategory from '../../../model/ProductCategory';

// Create a new Product Category with validation
export const createProductCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const adminId = req.userId;
    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    // Validation checks
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res
        .status(400)
        .json({ message: 'Name is required and must be a non-empty string.' });
    }

    if (description && typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string.' });
    }

    // Check if the category with the same name already exists
    const existingCategory = await ProductCategory.findOne({
      name: name.trim(),
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: 'A category with this name already exists.' });
    }

    // Create and save the new category
    const newCategory = new ProductCategory({
      categoryName: name.trim(),
      description,
    });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
