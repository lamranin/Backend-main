# Server

# Setup

## Database Setup
### PostgreSQL
You need docker-compose to run with PostgreSQL (will take some time for initial run)
```bash
npm run db:start
npm run db:push
```

## Run
### Database
```bash
npm run db:start
```

### Server
```bash
npm run start
```
The server runs in [http://localhost:1337/](http://localhost:1337/)

<hr>

# Utilities
### Check Database contents.
```bash
npm run db:show
```

### Edit `prisma/prisma.schema` and then migrate the database.
```bash
npm run db:restart
```
Or,
```bash
npm run db:push
```
git 
