
# Getting started


    
Install dependencies
    
    npm install

Create a .env file and write it as follows

    MONGO_URI='mongo URL'
    JWT_SECRET='YOURJWTSECRETCHANGEIT'
    ENCRYPT_JWT_SECRET='YOURJWTENCRIPTINGPASSCHANGEIT'
    JWT_EXPIRATION=8hrs
 
----------

## Database

The example codebase uses [Mongoose](https://mongoosejs.com/).

----------

## NPM scripts
- `npm run start:watch` - Start application in watch mode

----------
# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication.
This app uses <strong>refresh-Token</strong> mechanism to refresh jsonwebtoken after 8 hours.

----------
 