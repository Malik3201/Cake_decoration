import {
  getOrdersCsv,
  getProductsCsv,
  importProductsFromCsv,
} from '../services/report.service.js';

export async function exportOrdersCsvController(req, res, next) {
  try {
    const { from, to } = req.query;
    const csv = await getOrdersCsv({ from, to });
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export async function exportProductsCsvController(req, res, next) {
  try {
    const { from, to } = req.query;
    const csv = await getProductsCsv({ from, to });
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export async function importProductsCsvController(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ success: false, message: 'CSV file is required (form field: file)' });
    }

    const csvString = req.file.buffer.toString('utf-8');
    const result = await importProductsFromCsv(csvString);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}


