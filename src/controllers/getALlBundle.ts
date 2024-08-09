import { Request, Response } from 'express';
import { BundleProduct } from '../model/bundle';
export const getAllBundle = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNumber = parseInt(page as string, 10); // Parse page number as base-10 integer
    const limitNumber = parseInt(limit as string, 10); // Parse limit as base-10 integer
    const searchString = search as string;

    // Create a search filter
    const searchFilter = searchString
      ? { name: new RegExp(searchString, 'i') }
      : {};
    // Calculate total documents and total pages
    const totalDocuments = await BundleProduct.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    const bundleProducts = await BundleProduct.find(searchFilter)
      .populate('products')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    //  const bundleProducts = await BundleProduct.find()
    //    .populate('products')
    //   .exec();
    res.status(200).json({
      totalDocuments,
      totalPages,
      currentPage: pageNumber,
      bundleProducts,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ Message: error.message });
  }
};
