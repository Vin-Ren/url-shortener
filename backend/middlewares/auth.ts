import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envVars from '../envVars';
import { Request, User } from '../types';

const {JWT_SECRET_TOKEN} = envVars


function verifyToken(req: Request, res: Response, next: NextFunction) {
  const tokenHeader = req.headers.authorization
  if (!tokenHeader) {
    return res.sendStatus(403)
  }

  const token = tokenHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET_TOKEN)
    req.user = (decoded as User)
  } catch (err) {
    return res.sendStatus(403)
  }
  return next();
};

export default verifyToken;
