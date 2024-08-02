import { Request, Response } from 'express';
import Product from '../model/product';

export const blockProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, { blocked: true }, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
