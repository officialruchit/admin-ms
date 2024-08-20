import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';

export const getAllSales = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, name } = req.query;

        // Convert query parameters to integers
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        // Construct filter object
        const filter: any = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        // Fetch sales with filters, pagination, and population
        const sales = await Sales.find(filter)
            .populate('items.itemId')
            .skip(skip)
            .limit(limitNumber);

        // Get total count for pagination info
        const totalSales = await Sales.countDocuments(filter);

        return res.status(200).json({
            sales,
            pagination: {
                totalItems: totalSales,
                totalPages: Math.ceil(totalSales / limitNumber),
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};
