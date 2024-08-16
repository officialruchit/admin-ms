import { discount } from '../../../model/discount';
import { Request, Response } from 'express';
import { parse, isAfter, isValid } from 'date-fns';

export const createDiscount = async (req: Request, res: Response) => {
  try {
    const { percentage, description, validFrom, validTo } = req.body;
    const adminId = req.userId;

    // Check if the seller ID is present
    if (!adminId) {
      return res
        .status(404)
        .json({ message: 'Invalid admin; admin is not present' });
    }

    // Validate that all required fields are provided
    if (!percentage) {
      return res.status(400).json({ message: "percentage's data is missing" });
    }
    if (!description) {
      return res.status(400).json({ message: "description's data is missing" });
    }
    if (!validFrom) {
      return res.status(400).json({ message: "validFrom's data is missing" });
    }
    if (!validTo) {
      return res.status(400).json({ message: "validTo's data is missing" });
    }
    // Validate that percentage is a number and within range
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      return res.status(400).json({
        message: 'Discount percentage must be a number between 0 and 100.',
      });
    }

    // Parse the input dates from dd/mm/yyyy format
    const fromDate = parse(validFrom, 'dd/MM/yyyy', new Date());
    const toDate = parse(validTo, 'dd/MM/yyyy', new Date());

    // Validate the parsed dates
    if (!isValid(fromDate) || !isValid(toDate)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format; use dd/mm/yyyy.' });
    }

    const currentDate = new Date();

    // Validate that validFrom date is in the future
    if (!isAfter(fromDate, currentDate)) {
      return res
        .status(400)
        .json({ message: '"validFrom" date must be in the future.' });
    }

    // Validate that validTo date is after validFrom date
    if (!isAfter(toDate, fromDate)) {
      return res
        .status(400)
        .json({ message: '"validTo" date must be after "validFrom" date.' });
    }

    // Create and save the new discount
    const newDiscount = new discount({
      percentage,
      description,
      validFrom: fromDate,
      validTo: toDate,
      adminId,
    });

    const data = await newDiscount.save();
    res.status(201).json({ message: data });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
