import { Request, Response } from 'express';
import Admin from '../model/admin'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUpAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
   const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};