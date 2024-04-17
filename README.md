# project-hr
this project is an app for sending salary slip to the employee using whatsapp

run dev:
    npx nodemon app.js

untuk migration gunakan tools berikut:
    1. npm install -g sequelize-cli
    2. sequelize init
    3. sequelize migration:create --name create-books (create-books adalah contoh)
    4. masukan code untuk create table
    5. sequelize db:migrate
    6. check DB
