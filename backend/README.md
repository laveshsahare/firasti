# Firasti Backend

Spring Boot + MySQL backend for the Angular travel booking MVP.

## Prerequisites

- JDK 17 or newer
- Maven
- MySQL running locally

## Database

The app uses:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/veena_travel?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

Update `src/main/resources/application.properties` if your MySQL username or password differs.

## Email

The backend sends a welcome email after registration and a ticket email after booking. Set these environment variables before using email:

```powershell
$env:MAIL_USERNAME = 'your-email@gmail.com'
$env:MAIL_PASSWORD = 'your-gmail-app-password'
$env:MAIL_FROM = 'your-email@gmail.com'
```

For Gmail, use an app password instead of your normal account password.

## Cashfree Payments

Set your Cashfree PG credentials before starting the backend:

```powershell
$env:CASHFREE_CLIENT_ID = 'your_client_id'
$env:CASHFREE_CLIENT_SECRET = 'your_client_secret'
$env:CASHFREE_MODE = 'sandbox'
mvn spring-boot:run
```

Use `production` for `CASHFREE_MODE` only after switching to live Cashfree credentials. Do not commit real payment gateway secrets to `application.properties` or git.

## Run

```bash
cd backend
mvn spring-boot:run
```

On this machine you can also use:

```powershell
cd backend
.\run-backend.ps1
```

API base URL:

```text
http://localhost:8080/api
```

Seeded admin user:

```text
email: admin@firasti.com
password: admin@123
```

The backend seeds sample hotels, flights, and buses on first startup.
