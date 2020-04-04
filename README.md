# Example how to use Express and TypeORM with TypeScript

1. clone repository 
2. run `npm i`
3. edit `ormconfig.json` and change your database configuration (you can also change a database type, but don't forget to install specific database drivers)
4. run `npm start`

## How to use CLI?

1. install `typeorm` globally: `npm i -g typeorm`
2. run `typeorm -h` to show list of available commands
3. run `npm start` to start the server in debug environment, the server will watch for file changes and update accordingly.
4. run `npm prod` to build the production package.

## useful guides:

#### simple app using nodejs and express:
https://medium.com/javascript-in-plain-english/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

#### using nodejs in production with pm2 and apache:
https://www.serverlab.ca/tutorials/development/nodejs/run-nodejs-with-pm2-and-apache-2-4-on-ubuntu-18-04/
## commands to know:

### tools for typescript support:
`tsc`: creates a /build folder and converts .ts files into .js files

`ts-node`: allows node to run .ts projects (not recommended for production).

`ts-node-dev`: same as above, but restarts with every file change.


### typeorm:

`typeorm migration:create -n <migration_name>`: creates a new migration file