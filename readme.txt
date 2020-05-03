# DELILAH RESTO: API FOR FOOD DELIVERY SERVICES

With this API you can store products, create users, make and control orders, in order to manage your food delivery service. 

# ABOUT THE PROJECT

This API was the 3rd project of the Full-Stack Web Developer Course in the "Acamica" Institution (acamica.com). Coded by Nicolas Failla (https://github.com/nicolasfailla).

# INSTRUCTIONS

1. Install Node.js (https://nodejs.org)

2. Execute SQL query file (/db/database_queries.sql) in your database manager (for example MySQL though phpMyAdmin) in order to create the database. It comes with two products hardcoded and two users. One Admin (delilahAdmin) and one regular user (delilahUser). Don't forget to delete the first query "DROP DATABASE delilah_resto;" if you're creating the database for the first time. 

3. Install all modules. You can execute "npm install" in the terminal that will install automatically the modules compiled in the file "package.json". Or execute manually in the terminal:

"Install npm i express"
"Install npm i sequelize"
"Install npm i mysql2"
"Install npm i nodemon"
"Install npm i password-hash"
"Install npm i jsonwebtoken"

4. Please check the file "delilahResto_APIDocumentation_byNicolasFailla.yaml" in /api folder. There you will have all the documentation of the endpoints of the API to interact.

5. We provide two users with different passwords.
ADMIN:
username: delilahAdmin
password: pass1234
USER: delilahUser
username: user1234

6. In "js/index.js", "js/endpoints.js" and "js/functions.js", in line 15, you will have "const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah_resto");". Please check your local server url / port if you have to change anything.

7. Run "node /index.js" in your terminal. Please remember to locate the path of the "js" folder first. Matching the "login" endpoint (or creating a new user) will give you the Token necessary to interact with the API (check Documentation). 

# THANK YOU, HAVE FUN!