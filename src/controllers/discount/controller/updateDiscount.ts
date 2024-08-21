import { discount } from '../../../model/discount';
import { Request, Response } from 'express';
import { parse, isAfter, isValid } from 'date-fns';

export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { percentage, description, validFrom, validTo } = req.body;

    // Validate that all required fields are provided if they are present
    if (
      percentage !== undefined &&
      (typeof percentage !== 'number' || percentage < 0 || percentage > 100)
    ) {
      return res.status(400).json({
        message: 'Discount percentage must be a number between 0 and 100.',
      });
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string.' });
    }
    if (validFrom !== undefined) {
      const fromDate = parse(validFrom, 'dd/MM/yyyy', new Date());
      if (!isValid(fromDate)) {
        return res.status(400).json({
          message: 'Invalid "validFrom" date format; use dd/mm/yyyy.',
        });
      }
    }
    if (validTo !== undefined) {
      const toDate = parse(validTo, 'dd/MM/yyyy', new Date());
      if (!isValid(toDate)) {
        return res
          .status(400)
          .json({ message: 'Invalid "validTo" date format; use dd/mm/yyyy.' });
      }
    }

    // Find the existing discount
    const existingDiscount = await discount.findById(id);
    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Validate date ranges if provided
    const currentDate = new Date();
    if (validFrom) {
      const fromDate = parse(validFrom, 'dd/MM/yyyy', new Date());
      if (!isAfter(fromDate, currentDate)) {
        return res
          .status(400)
          .json({ message: '"validFrom" date must be in the future.' });
      }
    }
    if (validTo) {
      const toDate = parse(validTo, 'dd/MM/yyyy', new Date());
      if (!isAfter(toDate, currentDate)) {
        return res
          .status(400)
          .json({ message: '"validTo" date must be in the future.' });
      }
      if (validFrom) {
        const fromDate = parse(validFrom, 'dd/MM/yyyy', new Date());
        if (!isAfter(toDate, fromDate)) {
          return res.status(400).json({
            message: '"validTo" date must be after "validFrom" date.',
          });
        }
      }
    }

    // Update the discount with the provided data
    const updatedDiscount = await discount.findByIdAndUpdate(
      id, 
      {
        percentage,
        description,
        validFrom: validFrom
          ? parse(validFrom, 'dd/MM/yyyy', new Date())
          : existingDiscount.validFrom,
        validTo: validTo
          ? parse(validTo, 'dd/MM/yyyy', new Date())
          : existingDiscount.validTo,
      },
      { new: true },
    );

    if (!updatedDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({
      message: 'Discount updated successfully',
      discount: updatedDiscount,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
