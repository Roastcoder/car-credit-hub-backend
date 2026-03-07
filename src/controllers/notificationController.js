import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const subscribe = async (req, res) => {
  const subscription = req.body;
  await req.db.query(
    'INSERT INTO push_subscriptions (user_id, subscription) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET subscription = $2',
    [req.user.id, JSON.stringify(subscription)]
  );
  res.status(201).json({ message: 'Subscribed' });
};

export const sendNotification = async (req, res) => {
  const { userId, title, body, url } = req.body;
  const result = await req.db.query('SELECT subscription FROM push_subscriptions WHERE user_id = $1', [userId]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'No subscription found' });
  }

  const payload = JSON.stringify({ title, body, url });
  await webpush.sendNotification(JSON.parse(result.rows[0].subscription), payload);
  res.json({ message: 'Notification sent' });
};
