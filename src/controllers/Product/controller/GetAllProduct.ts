import { Request, Response } from 'express';
import { Product } from '../../../model/product';

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const PageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const searching = search as string;
    const filetr = searching ? { name: new RegExp(searching, 'i') } : {};
    const totalDocs = await Product.countDocuments(filetr);
    const totalPages = Math.ceil(totalDocs / limitNumber);
    const products = await Product.find(filetr).limit(limitNumber);
    res
      .status(200)
      .json({ totalDocs, totalPages, PageNumber, limitNumber, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
