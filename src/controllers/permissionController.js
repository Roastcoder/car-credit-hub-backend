import db from '../config/database.js';

export const getFieldPermissions = async (req, res) => {
  try {
    const result = await db.query('SELECT permissions FROM field_permissions WHERE id = 1');
    if (result.rows.length === 0) {
      return res.json({ permissions: {} });
    }
    res.json({ permissions: result.rows[0].permissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFieldPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const result = await db.query(
      `INSERT INTO field_permissions (id, permissions, updated_at) 
       VALUES (1, $1, NOW()) 
       ON CONFLICT (id) 
       DO UPDATE SET permissions = $1, updated_at = NOW() 
       RETURNING id`,
      [JSON.stringify(permissions)]
    );
    res.json({ message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
