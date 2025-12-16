import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/decora_bake';
  await mongoose.connect(MONGODB_URI);

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

  console.log('Seeding users...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@decorabake.test',
    password: 'AdminPass123!',
    role: 'admin',
  });

  const customer = await User.create({
    name: 'Test Customer',
    email: 'customer@decorabake.test',
    password: 'CustomerPass123!',
    role: 'user',
  });

  console.log('Seeding categories...');
  const cakes = await Category.create({
    name: 'Cakes',
    description: 'Custom cakes and celebration cakes',
  });

  const cupcakes = await Category.create({
    name: 'Cupcakes',
    description: 'Decorated cupcakes',
  });

  console.log('Seeding products...');
  const birthdayCake = await Product.create({
    title: 'Birthday Chocolate Cake',
    description: 'Rich chocolate cake with custom decoration',
    price: 40,
    salePrice: 35,
    category: cakes._id,
    featured: true,
    stock: 50,
    images: ['/images/products/birthday-chocolate-cake.jpg'],
    seoTitle: 'Birthday Chocolate Cake | DecoraBake',
    seoDescription: 'Order a rich chocolate birthday cake with custom decoration.',
  });

  const vanillaCupcake = await Product.create({
    title: 'Vanilla Cupcake Box (6)',
    description: 'Box of 6 vanilla cupcakes with themed decorations',
    price: 18,
    salePrice: null,
    category: cupcakes._id,
    featured: false,
    stock: 100,
    images: ['/images/products/vanilla-cupcakes-6.jpg'],
  });

  console.log('Seeding sample order...');
  await Order.create({
    user: customer._id,
    items: [
      {
        product: birthdayCake._id,
        quantity: 1,
        unitPrice: birthdayCake.price,
        unitSalePrice: birthdayCake.salePrice,
      },
      {
        product: vanillaCupcake._id,
        quantity: 2,
        unitPrice: vanillaCupcake.price,
        unitSalePrice: null,
      },
    ],
    totalAmount: 35 + 2 * 18,
    status: 'paid',
    paymentStatus: 'succeeded',
    paidAt: new Date(),
  });

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});


