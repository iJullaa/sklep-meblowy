import prisma from '../config/prisma.js';

export const createOrder = async (req, res, next) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Brak produktów w zamówieniu' });
    }

    const productIds = orderItems.map((item) => item.productId);
    const productsFromDb = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalPrice = 0;
    const stockUpdates = []; 

    for (const item of orderItems) {
      const product = productsFromDb.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ message: `Nie znaleziono produktu o ID: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Niewystarczająca ilość produktu: ${product.name}` });
      }
      totalPrice += product.price * item.quantity;

      stockUpdates.push(
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }, 
        })
      );
    }

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId: req.user.id,
          total: totalPrice,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productsFromDb.find((p) => p.id === item.productId).price,
            })),
          },
        },
        include: {
          items: true,
        },
      }),
      ...stockUpdates,
    ]);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status jest wymagany' });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.status(200).json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Nie znaleziono zamówienia' });
    }
    next(error);
  }
};