import db from '../config/database.js';

export const getUserNotifications = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    // Auto-delete after 1 minute
    setTimeout(async () => {
      await db.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    }, 60000);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING id',
      [req.user.id]
    );
    // Auto-delete all after 1 minute
    setTimeout(async () => {
      const ids = result.rows.map(r => r.id);
      if (ids.length > 0) {
        await db.query('DELETE FROM notifications WHERE id = ANY($1)', [ids]);
      }
    }, 60000);
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const broadcastNotification = async (req, res) => {
  try {
    const { title, body, url } = req.body;
    
    // Get all users
    const users = await db.query('SELECT id FROM users WHERE status = $1', ['active']);
    
    if (users.rows.length === 0) {
      return res.json({ message: 'No active users found' });
    }

    // Create in-app notifications for all users
    const notifications = users.rows.map(user => 
      db.query(
        'INSERT INTO notifications (user_id, title, message, url, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [user.id, title, body, url || '/dashboard']
      ).catch(err => console.error(`Failed to create notification for user ${user.id}:`, err))
    );
    
    await Promise.all(notifications);
    res.json({ message: `Notification sent to ${users.rows.length} users` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
