import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';
import { Product } from '../../../model/product';
import { BundleProduct } from '../../../model/bundle';

export const addProductToSale = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { itemId, itemType } = req.body;

        // Validate presence of required fields
        if (!itemId || !itemType) {
            return res.status(400).json({ message: 'itemId and itemType are required' });
        }

        // Validate itemType
        if (!['Product', 'Bundle'].includes(itemType)) {
            return res.status(400).json({ message: 'Invalid item type. Must be either "Product" or "Bundle"' });
        }

        // Find the sale by ID
        const sale = await Sales.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Check if the item exists in the respective collection
        let item;
        if (itemType === 'Product') {
            item = await Product.findById(itemId);
        } else if (itemType === 'Bundle') {
            item = await BundleProduct.findById(itemId);
        }

        if (!item) {
            return res.status(404).json({ message: `${itemType} not found` });
        }

        // Check if the item is already added to the sale
        const isItemAlreadyInSale = sale.items.some((saleItem) => saleItem.itemId.toString() === itemId && saleItem.itemType === itemType);
        if (isItemAlreadyInSale) {
            return res.status(400).json({ message: `${itemType} is already added to the sale` });
        }

        // Add the item to the sale
        sale.items.push({ itemId, itemType });
        await sale.save();

        return res.status(200).json({ message: `${itemType} added to sale`, sale });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};
