import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { Category } from '../models/category.model.js';

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  // NaN check
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function getOrdersCsv({ from, to }) {
  const query = {};
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = fromDate;
    if (toDate) query.createdAt.$lte = toDate;
  }

  const orders = await Order.find(query)
    .populate('user')
    .populate('items.product')
    .sort({ createdAt: -1 });

  const headers = [
    'orderId',
    'createdAt',
    'customerEmail',
    'status',
    'paymentStatus',
    'totalAmount',
    'currency',
    'itemProductTitle',
    'itemQuantity',
    'itemUnitPrice',
    'itemUnitSalePrice',
  ];

  const rows = [headers.join(',')];

  for (const order of orders) {
    for (const item of order.items) {
      const cols = [
        order._id.toString(),
        order.createdAt.toISOString(),
        order.user?.email || '',
        order.status,
        order.paymentStatus,
        order.totalAmount,
        order.currency,
        item.product?.title || '',
        item.quantity,
        item.unitPrice,
        item.unitSalePrice ?? '',
      ];
      rows.push(cols.map(String).join(','));
    }
  }

  return rows.join('\n');
}

export async function getProductsCsv({ from, to }) {
  const query = {};
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = fromDate;
    if (toDate) query.createdAt.$lte = toDate;
  }

  const products = await Product.find(query).populate('category').sort({ title: 1 });

  const headers = [
    'title',
    'description',
    'price',
    'salePrice',
    'categoryName',
    'featured',
    'stock',
    'seoTitle',
    'seoDescription',
  ];

  const rows = [headers.join(',')];

  for (const p of products) {
    const cols = [
      p.title || '',
      (p.description || '').replace(/[\r\n]+/g, ' '),
      p.price,
      p.salePrice ?? '',
      p.category?.name || '',
      p.featured,
      p.stock,
      p.seoTitle || '',
      (p.seoDescription || '').replace(/[\r\n]+/g, ' '),
    ];
    rows.push(cols.map(String).join(','));
  }

  return rows.join('\n');
}

export async function importProductsFromCsv(csvString) {
  if (!csvString) return { created: 0 };

  const lines = csvString
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return { created: 0 };

  const headers = lines[0].split(',').map(h => h.trim());

  const idx = name => headers.indexOf(name);
  const titleIdx = idx('title');
  const descIdx = idx('description');
  const priceIdx = idx('price');
  const salePriceIdx = idx('salePrice');
  const categoryNameIdx = idx('categoryName');
  const featuredIdx = idx('featured');
  const stockIdx = idx('stock');
  const seoTitleIdx = idx('seoTitle');
  const seoDescIdx = idx('seoDescription');

  let created = 0;

  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(',');
    if (!cols[titleIdx]) continue;

    const title = cols[titleIdx];
    const description = cols[descIdx] || '';
    const price = Number(cols[priceIdx] || 0);
    const salePriceRaw = cols[salePriceIdx];
    const salePrice =
      salePriceRaw === undefined || salePriceRaw === '' ? null : Number(salePriceRaw);
    const categoryName = cols[categoryNameIdx] || '';
    const featured = cols[featuredIdx] === 'true';
    const stock = Number(cols[stockIdx] || 0);
    const seoTitle = cols[seoTitleIdx] || '';
    const seoDescription = cols[seoDescIdx] || '';

    if (!categoryName) {
      // skip if we can't map category
      // eslint-disable-next-line no-continue
      continue;
    }

    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await Category.create({ name: categoryName });
    }

    await Product.create({
      title,
      description,
      price,
      salePrice,
      category: category._id,
      featured,
      stock,
      seoTitle,
      seoDescription,
    });

    created += 1;
  }

  return { created };
}


