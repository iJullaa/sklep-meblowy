import prisma from "../config/prisma.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
    });
    res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, imageUrl, stock } = req.body;
    if (!name || !price || !description || !imageUrl || !stock) {
      return res.status(400).json({ message: 'Proszę wypełnić wszystkie wymagane pola' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        imageUrl,
        stock: parseInt(stock),
        },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};