import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 

export const generateConfirmationToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyConfirmationToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
};