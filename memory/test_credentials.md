
Action: file_editor create /app/memory/test_credentials.md --file-text "# Test Credentials for Cashew ERP

All accounts use simple passwords for testing.

## Admin
- Email: `admin@cashewerp.com`
- Password: `admin123`
- Role: admin

## Sales Manager
- Email: `sales@cashewerp.com`
- Password: `sales123`
- Role: sales_manager

## Production Manager
- Email: `production@cashewerp.com`
- Password: `prod123`
- Role: production_manager

## Inventory Manager
- Email: `inventory@cashewerp.com`
- Password: `inv123`
- Role: inventory_manager

## Accounts Manager
- Email: `accounts@cashewerp.com`
- Password: `acc123`
- Role: accounts_manager

## Dispatch Manager
- Email: `dispatch@cashewerp.com`
- Password: `disp123`
- Role: dispatch_manager

## Auth Endpoints
- POST `/api/auth/login` — body `{\"email\",\"password\"}`, sets cookie + returns user+token
- POST `/api/auth/logout`
- GET `/api/auth/me`
- GET `/api/auth/users` (admin only)
"
Observation: Overwrite successful: /app/memory/test_credentials.md