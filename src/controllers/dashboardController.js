import db from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalLoans = await db.query('SELECT COUNT(*) as count FROM loans');
    const activeLoans = await db.query('SELECT COUNT(*) as count FROM loans WHERE status IN ($1, $2)', ['pending', 'approved']);
    const totalDisbursed = await db.query('SELECT COALESCE(SUM(loan_amount), 0) as total FROM loans WHERE status = $1', ['disbursed']);
    const pendingCommissions = await db.query('SELECT COALESCE(SUM(amount), 0) as total FROM commissions WHERE status = $1', ['pending']);
    
    const recentLoans = await db.query(`
      SELECT l.*, b.name as bank_name, u.name as user_name
      FROM loans l
      LEFT JOIN banks b ON l.bank_id = b.id
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 10
    `);

    const loansByStatus = await db.query(`
      SELECT status, COUNT(*) as count
      FROM loans
      GROUP BY status
    `);

    const monthlyLoans = await db.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count, SUM(loan_amount) as total_amount
      FROM loans
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      stats: {
        totalLoans: parseInt(totalLoans.rows[0].count),
        activeLoans: parseInt(activeLoans.rows[0].count),
        totalDisbursed: parseFloat(totalDisbursed.rows[0].total),
        pendingCommissions: parseFloat(pendingCommissions.rows[0].total)
      },
      recentLoans: recentLoans.rows,
      loansByStatus: loansByStatus.rows,
      monthlyLoans: monthlyLoans.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
