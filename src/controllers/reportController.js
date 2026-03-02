import db from '../config/database.js';

export const getLoanReport = async (req, res) => {
  try {
    const { start_date, end_date, bank_id, status } = req.query;
    let query = 'SELECT l.*, b.name as bank_name, u.name as user_name FROM loans l LEFT JOIN banks b ON l.bank_id = b.id LEFT JOIN users u ON l.user_id = u.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (start_date) {
      query += ` AND l.created_at >= $${paramCount++}`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND l.created_at <= $${paramCount++}`;
      params.push(end_date);
    }
    if (bank_id) {
      query += ` AND l.bank_id = $${paramCount++}`;
      params.push(bank_id);
    }
    if (status) {
      query += ` AND l.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommissionReport = async (req, res) => {
  try {
    const { start_date, end_date, broker_id, status } = req.query;
    let query = 'SELECT c.*, l.loan_number, b.name as broker_name FROM commissions c LEFT JOIN loans l ON c.loan_id = l.id LEFT JOIN brokers b ON c.broker_id = b.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (start_date) {
      query += ` AND c.created_at >= $${paramCount++}`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND c.created_at <= $${paramCount++}`;
      params.push(end_date);
    }
    if (broker_id) {
      query += ` AND c.broker_id = $${paramCount++}`;
      params.push(broker_id);
    }
    if (status) {
      query += ` AND c.status = $${paramCount++}`;
      params.push(status);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.name, u.role, COUNT(l.id) as total_loans, SUM(l.loan_amount) as total_amount
      FROM users u
      LEFT JOIN loans l ON u.id = l.user_id
      GROUP BY u.id, u.name, u.role
      ORDER BY total_amount DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
