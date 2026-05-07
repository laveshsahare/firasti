# Deployment Notes

## Frontend on Vercel

Set this environment variable in the Vercel project before deploying:

```text
API_URL=https://veena-backend-fam6.onrender.com/api
```

Examples:

```text
API_URL=https://veena-backend-fam6.onrender.com/api
API_URL=https://your-service.up.railway.app/api
```

The build script writes this value into the Angular production environment. If `API_URL` is not set, it defaults to the Render backend above.

## Backend on Render or Railway

Set these backend environment variables:

```text
PORT=8080
DB_URL=jdbc:mysql://host:port/database
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
CORS_ALLOWED_ORIGINS=https://romify-travel-and-tours.vercel.app
FRONTEND_BASE_URL=https://romify-travel-and-tours.vercel.app
RAZORPAY_KEY_ID=rzp_test_or_live_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

For Vercel preview URLs, the backend also allows this pattern by default:

```text
https://*.vercel.app
```

Use `/health` or `/api/health` as the backend health-check path.
