import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import admin from '../model/admin';

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      roles = ['user'],
      isAdmin = false,
    } = req.body;

    const existingUser = await admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new admin({
      username,
      email,
      password: hashedPassword,
      roles,
      isAdmin: roles.includes('admin') || isAdmin,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
