import { Request, Response } from 'express';
import { parse, isAfter, isValid } from 'date-fns';
import { discount } from '../../../model/discount';

/**
 * Controller function to update an existing discount.
 *
 * @param req - Express Request object, containing the discount data to be updated and the discount ID.
 * @param res - Express Response object, used to send the response back to the client.
 */
export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const discountId = req.params.id; // The discount ID to be updated
    const adminId = req.userId; // Extract the admin ID from the request object (assuming it's set by middleware)
    const {
      percentage,
      description,
      validFrom,
      validTo,
      type,
      productIds,
      bundleIds,
    } = req.body;

    // Check if the admin ID is present
    if (!adminId) {
      return res
        .status(404)
        .json({ message: 'Invalid admin; admin is not present' });
    }

    // Find the existing discount by ID
    const existingDiscount = await discount.findById(discountId);
    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found.' });
    }

    // Validate that percentage is within range if provided
    if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
      return res.status(400).json({
        message: 'Discount percentage must be a number between 0 and 100.',
      });
    }

    // Parse the input dates from dd/MM/yyyy format if provided
    let fromDate;
    let toDate;
    if (validFrom) {
      fromDate = parse(validFrom, 'dd/MM/yyyy', new Date());
      if (!isValid(fromDate)) {
        return res.status(400).json({
          message: 'Invalid "validFrom" date format; use dd/MM/yyyy.',
        });
      }
    }

    if (validTo) {
      toDate = parse(validTo, 'dd/MM/yyyy', new Date());
      if (!isValid(toDate)) {
        return res
          .status(400)
          .json({ message: 'Invalid "validTo" date format; use dd/MM/yyyy.' });
      }
    }

    // Validate that validFrom date is in the future if provided
    if (fromDate && !isAfter(fromDate, new Date())) {
      return res
        .status(400)
        .json({ message: '"validFrom" date must be in the future.' });
    }

    // Validate that validTo date is after validFrom date if both are provided
    if (fromDate && toDate && !isAfter(toDate, fromDate)) {
      return res
        .status(400)
        .json({ message: '"validTo" date must be after "validFrom" date.' });
    }

    // Update the discount fields if provided
    if (percentage !== undefined) existingDiscount.percentage = percentage;
    if (description) existingDiscount.description = description;
    if (validFrom) existingDiscount.validFrom = fromDate!;
    if (validTo) existingDiscount.validTo = toDate!;
    if (type) existingDiscount.type = type;
    if (productIds) existingDiscount.productIds = productIds;
    if (bundleIds) existingDiscount.bundleIds = bundleIds;

    // Save the updated discount to the database
    const updatedDiscount = await existingDiscount.save();
    res.status(200).json({
      message: 'Discount updated successfully.',
      data: updatedDiscount,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
};
