import prisma from "../config/prisma.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nazwa kategorii jest wymagana' });
    }
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Kategoria o tej nazwie już istnieje' });
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name },
    });
    res.status(200).json(category);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Nie znaleziono kategorii' });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Kategoria została usunięta' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Nie znaleziono kategorii' });
    }
    next(error);
  }
};