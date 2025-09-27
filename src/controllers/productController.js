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

export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Nie znaleziono produktu' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, price, description, imageUrl, stock } = req.body;

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
        description,
        imageUrl,
        stock: stock ? parseInt(stock) : undefined,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Nie znaleziono produktu' });
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    res.status(200).json({ message: 'Produkt został usunięty' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Nie znaleziono produktu' });
    }
    next(error);
  }
};