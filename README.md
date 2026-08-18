# Valk

A simple Black Desert Online Discord bot for tracking a guild roster & member gear

## Discord Bot Setup

1. Go to <https://discord.com/developers/applications>
2. Sign in then create a new application in the top right
3. Go to `Bot` tab on the left sidebar of your application
4. Reset token, confirm, then copy the token for your `.env` which your bot will use to login

## Installation

```bash
# Install dependencies
npm i
# Create a local environment file
cp .env.example .env
# Fill in DATABASE_URL and DISCORD_TOKEN in .env

# Build the application
npm run build
# Run the built server with Node.js 20.6+
node --env-file=.env build
```

## Development

```bash
# Install dependencies
npm i
# Create a local environment file
cp .env.example .env
# Run the application in development mode
npm run dev
```

Migrations

```bash
# Create new migration when schema changes
npm run db:generate
# Apply migrations (Optional - done automatically on app start)
npm run db:migrate
```
