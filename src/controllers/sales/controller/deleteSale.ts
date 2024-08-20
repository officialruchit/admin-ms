import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';

export const deleteSale = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Find and delete the sale
        const sale = await Sales.findByIdAndDelete(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        return res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (err) {
        const error = err as Error
        res.status(401).json({ message: error.message })
    }
};
