import { Request, Response } from 'express';
import { Sales } from '../../../model/sales';
import { parse, isValid } from 'date-fns';

export const createSales = async (req: Request, res: Response) => {
    try {
        const { name, validFrom, validTo } = req.body;

        // Validation
        if (!name || !validFrom || !validTo) {
            return res.status(400).json({ message: "Name, validFrom, and validTo are required fields." });
        }

        // Parse dates and check format (dd/mm/yyyy)
        const parsedValidFrom = parse(validFrom, 'dd/MM/yyyy', new Date());
        const parsedValidTo = parse(validTo, 'dd/MM/yyyy', new Date());

        if (!isValid(parsedValidFrom) || !isValid(parsedValidTo)) {
            return res.status(400).json({ message: "Invalid date format. Please use dd/MM/yyyy." });
        }

        // Create new sale
        const newSale = new Sales({
            name, 
            validFrom: parsedValidFrom, 
            validTo: parsedValidTo
        });

        await newSale.save();
        res.status(201).json({ message: "Created new sale", Sales: newSale });
    } catch (err) {
        const error = err as Error;
        res.status(401).json({ message: error.message });
    }
};
