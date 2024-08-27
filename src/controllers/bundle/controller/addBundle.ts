import { Request, Response } from 'express';
import { BundleProduct } from '../../../model/bundle';
import { Product, IProduct } from '../../../model/product'; // Import IProduct interface
import mongoose from 'mongoose';

export const createBundleProduct = async (req: Request, res: Response) => {
  try {
    const adminId = req.userId;
    const { name, description, products, discountPercentage } = req.body;

    // Validate seller ID
    if (!adminId) {
      return res
        .status(400)
        .json({ message: 'Invalid seller; seller is not present' });
    }

    // Validate the presence of name
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Validate the presence of description
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Validate the products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one product is required' });
    }

    // Validate discount percentage
    if (
      discountPercentage &&
      (typeof discountPercentage !== 'number' ||
        discountPercentage < 0 ||
        discountPercentage > 100)
    ) {
      return res
        .status(400)
        .json({ message: 'Discount must be a number between 0 and 100' });
    }

    // Validate and convert product IDs to MongoDB ObjectId instances
    const productObjectIds = products.map((productId: string) => {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res
          .status(400)
          .json({ message: `Invalid product ID: ${productId}` });
      }
      return new mongoose.Types.ObjectId(productId);
    });

    // Fetch product data for the given IDs, specifying the type of the documents as IProduct
    const productsData: IProduct[] = await Product.find({
      _id: { $in: productObjectIds },
    });

    // Check if all products were found
    if (productsData.length !== productObjectIds.length) {
      return res
        .status(404)
        .json({ message: 'One or more products not found' });
    }

    // Calculate the total original price of the products
    const totalOriginalPrice = productsData.reduce(
      (total, product) => total + product.price,
      0,
    );
    // Calculate the discount price based on the discount percentage
    const discountPrice = discountPercentage
      ? totalOriginalPrice * (1 - discountPercentage / 100)
      : totalOriginalPrice;
    const totalPrice = totalOriginalPrice;

    // Create a new BundleProduct instance
    const bundleProduct = new BundleProduct({
      adminId,
      name,
      description,
      products: productObjectIds,
      discountPercentage,
      discountPrice,
      totalPrice,
    });

    // Save the bundle product to the database
    await bundleProduct.save();

    // Respond with a success message and the created bundle product
    res.status(201).json({ message: 'Bundle product created', bundleProduct });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
