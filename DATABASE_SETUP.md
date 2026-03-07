# Database Setup Instructions

## Required Tables for New Features

Run this migration to add all required tables:

```bash
psql your_database_name < migrations/complete_setup.sql
```

## Tables Added:

1. **push_subscriptions** - For web push notifications
   - Stores user push notification subscriptions
   - Required for broadcast notifications

2. **field_permissions** - For role-based field access
   - Stores field-level permissions per role
   - Used by permissions management

3. **branches** - For branch management
   - Stores branch information
   - Links users and loans to branches

## Columns Added:

- `users.branch_id` - Links user to branch
- `loans.created_by` - Tracks who created the loan
- `loans.branch_id` - Links loan to branch
- `leads.created_by` - Tracks who created the lead
- `leads.branch_id` - Links lead to branch

## Updated Constraints:

- `users.role` - Now supports: super_admin, admin, manager, bank, broker, employee

## After Running Migration:

1. Restart the backend server
2. Test the new endpoints:
   - `/api/notifications/broadcast`
   - `/api/users/:id/role`
   - `/api/field-permissions`

## Quick Test:

```bash
# Check if tables exist
psql your_database_name -c "\dt push_subscriptions"
psql your_database_name -c "\dt field_permissions"
psql your_database_name -c "\dt branches"
```

## Troubleshooting:

If you get errors about existing tables, that's okay - the migration uses `IF NOT EXISTS` and `DO $$` blocks to handle existing structures safely.
