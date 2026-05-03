# SukhakarPrawas Backend

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
email: admin@veena.com
password: admin@123
```

The backend seeds sample hotels, flights, and buses on first startup.
