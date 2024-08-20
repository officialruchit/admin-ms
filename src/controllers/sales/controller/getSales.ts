import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';

export const getSaleDetails = async (req: Request, res: Response) => {
    try {
        const  id  = req.params.id;

        // Find the sale
        const sale = await Sales.findById(id).populate('items.itemId');
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        return res.status(200).json({ sale });
    } catch (err) {
        const error = err as Error
        res.status(401).json({ message: error.message })
    }
};
