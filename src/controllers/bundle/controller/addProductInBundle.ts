import { Request, Response } from 'express';
import { BundleProduct, IBundleProduct } from '../../../model/bundle';
import mongoose from 'mongoose';
import { Product, IProduct } from '../../../model/product'; // Import the IProduct interface

// Add a product to a bundle
export const addProductToBundle = async (req: Request, res: Response) => {
  try {
    const { bundleId, productId } = req.params;

    // Ensure productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Find the bundle to check if the product is already in the bundle
    const bundle = (await BundleProduct.findById(bundleId)) as IBundleProduct;
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    // Check if the product is already in the bundle
    if (bundle.products.includes(new mongoose.Types.ObjectId(productId))) {
      return res
        .status(400)
        .json({ message: 'Product is already in the bundle' });
    }

    // Add the product to the bundle
    bundle.products.push(new mongoose.Types.ObjectId(productId));

    // Fetch the updated list of products in the bundle, specifying the type
    const productsData: IProduct[] = await Product.find({
      _id: { $in: bundle.products },
    });

    // Calculate the total original price of the products
    const totalOriginalPrice = productsData.reduce(
      (total, product) => total + product.price,
      0,
    );

    // Update the total and discount prices
    bundle.totalPrice = totalOriginalPrice;
    bundle.discountPrice = bundle.discountPercentage
      ? totalOriginalPrice * (1 - bundle.discountPercentage / 100)
      : totalOriginalPrice;

    // Save the updated bundle
    await bundle.save();

    res.status(200).json({ message: 'Product added to bundle', bundle });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ message: error.message });
  }
};
