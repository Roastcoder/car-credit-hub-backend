import db from '../config/database.js';
import { buildUpdateQuery } from '../utils/postgres.js';

export const getAllLoans = async (req, res) => {
  try {
    const { status, bank_id, user_id } = req.query;
    let query = `
      SELECT l.*, 
        b.name as bank_name, 
        br.name as broker_name, 
        u.name as user_name,
        ab.name as assigned_bank_name,
        abr.name as assigned_broker_name
      FROM loans l
      LEFT JOIN banks b ON l.bank_id = b.id
      LEFT JOIN brokers br ON l.broker_id = br.id
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN banks ab ON l.assigned_bank_id = ab.id
      LEFT JOIN brokers abr ON l.assigned_broker_id = abr.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND l.status = $${paramCount++}`;
      params.push(status);
    }
    if (bank_id) {
      query += ` AND (l.bank_id = $${paramCount} OR l.assigned_bank_id = $${paramCount})`;
      paramCount++;
      params.push(bank_id);
    }
    if (user_id) {
      query += ` AND l.user_id = $${paramCount++}`;
      params.push(user_id);
    }

    query += ' ORDER BY l.created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT l.*, 
        b.name as bank_name, 
        br.name as broker_name, 
        u.name as user_name,
        ab.name as assigned_bank_name,
        abr.name as assigned_broker_name
      FROM loans l
      LEFT JOIN banks b ON l.bank_id = b.id
      LEFT JOIN brokers br ON l.broker_id = br.id
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN banks ab ON l.assigned_bank_id = ab.id
      LEFT JOIN brokers abr ON l.assigned_broker_id = abr.id
      WHERE l.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await db.query(
      `INSERT INTO loans (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    res.status(201).json({ message: 'Loan created successfully', loanId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const { query, values } = buildUpdateQuery('loans', req.body, req.params.id);
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json({ message: 'Loan updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM loans WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
