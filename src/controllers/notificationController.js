import db from '../config/database.js';

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
