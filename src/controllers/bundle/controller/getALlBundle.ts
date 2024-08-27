import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
export const getAllBundle = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    const pageNumber = parseInt(req.query.page as string, 10) || 1;
    const limitNumber = parseInt(req.query.limit as string, 10) || 10;
    const searchString = (req.query.search as string) || '';

    // Validate page and limit numbers
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ Message: 'Invalid page or limit number' });
    }

    if (!adminId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized access: Admin ID is missing' });
    }
    // Create a search filter based on the search query
    const searchFilter = searchString
      ? { name: new RegExp(searchString, 'i') }
      : {};
    // Calculate total documents and total pages
    const totalDocuments = await BundleProduct.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    // Fetch the bundle products based on the search filter and pagination
    const bundleProducts = await BundleProduct.find(searchFilter)
      .populate({
        path: 'products',
        select: 'name description price quantity',
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    // Return the paginated bundle products along with metadata
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
