const INDIVIDUAL_ENV_EXPLAINATIONS = {
    'DATABASE_URL': 'The postgres database url which typically looks like this: postgres://username:password@host:port/database_name',
    'JWT_SECRET': 'The JWT secret key for authentication. Run `npm run gen:jwt` to generate a new one.',
    'NEXT_PUBLIC_APP_URL': 'The url of the app. This is used to generate the correct url for the app.',
    'ADMIN_EMAIL': 'The email of the admin user. This is used to generate the admin user.',
    'GITHUB_CLIENT_ID': 'The client id for the github oauth. This is used to generate the github oauth url.',
    'GITHUB_CLIENT_SECRET': 'The client secret for the github oauth. This is used to generate the github oauth url.',
    'GOOGLE_CLIENT_ID': 'The client id for the google oauth. This is used to generate the google oauth url.',
    'GOOGLE_CLIENT_SECRET': 'The client secret for the google oauth. This is used to generate the google oauth url.',
    'DISCORD_CLIENT_ID': 'The client id for the discord oauth. This is used to generate the discord oauth url.',
    'DISCORD_CLIENT_SECRET': 'The client secret for the discord oauth. This is used to generate the discord oauth url.',
}

const REQUIRED_ENVS = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_APP_URL',
]

const FULL_AUTH_ENVS = [
    'ADMIN_EMAIL',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
]

const ADVISED_ENVS = [
    ...FULL_AUTH_ENVS,
]

const MISSING_ENVS = REQUIRED_ENVS.filter(env => !process.env[env])
const MISSING_ADVISED_ENVS = ADVISED_ENVS.filter(env => !process.env[env])
