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