# Example how to use Express and TypeORM with TypeScript

1. clone repository 
2. run `npm i`
3. edit `ormconfig.json` and change your database configuration (you can also change a database type, but don't forget to install specific database drivers)
4. run `npm start`

## How to use CLI?

1. `npm install`
2. `npm run prisma-gen` will tell prisma to analyse the database and create datamodels from it.
3. run `npm start` to start the server in debug environment, the server will watch for file changes and update accordingly.
4. run `npm prod` to build the production package.

## useful guides:

#### using nodejs in production with pm2 and apache:
https://www.serverlab.ca/tutorials/development/nodejs/run-nodejs-with-pm2-and-apache-2-4-on-ubuntu-18-04/

#### express framework best practices for production.
https://expressjs.com/en/advanced/best-practice-performance.html

## commands to know:

### tools for typescript support:
`tsc`: creates a /build folder and converts .ts files into .js files

`ts-node`: allows node to run .ts projects (not recommended for production).

`ts-node-dev`: same as above, but restarts with every file change.

`npx prisma`: the prisma cli tool.

`npx prisma introspect`: introspecting the database scheme and converting it to typescript types.

`npx prisma generate`: convering the prisma scheme into a usable typescript module.