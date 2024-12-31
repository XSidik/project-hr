# Project HR

This project is an app for sending salary slips to employees using WhatsApp.  
It uses Node.js, Express, and whatsapp-web.js.  
The project uses PostgreSQL as the database.  
It is still in development, and there are still many errors.

## Run Development Server

```sh
npx nodemon app.js
```

## Database Migration

Use the following tools for migration:

1. Install Sequelize CLI globally:
    ```sh
    npm install -g sequelize-cli
    ```
2. Initialize Sequelize:
    ```sh
    sequelize init
    ```
3. Run the migration:
    ```sh
    sequelize db:migrate
    ```
4. Check the database.

## Insert Seeder

Run the following command to insert seed data:

```sh
sequelize db:seed:all
```

## Contributing

Everybody is welcome to add features, update, or do anything to make this code better.

## Contact

For any questions or feedback, please contact [nursidik.2427@gmail.com].
