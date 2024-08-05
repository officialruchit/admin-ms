import { Request, Response } from 'express';
import ProductCategory from '../model/ProductCategory';

// Create a new Product Category
export const createProductCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description } = req.body;
    const newCategory = new ProductCategory({ categoryId, name, description });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};