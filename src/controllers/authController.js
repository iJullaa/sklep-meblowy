import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Proszę podać email i hasło');
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ApiError(400, 'Użytkownik o tym emailu już istnieje');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: generateToken(user.id),
      });
    } else {
      throw new ApiError(401, 'Nieprawidłowy email lub hasło');
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  res.status(200).json(req.user);
};