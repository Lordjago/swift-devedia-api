import express from 'express'
import App from './services/ExpressApp.js'
import dbConnection from './services/Database.js'
import config from './config/index.js';
import colors from 'colors';

const StartServer = async () => {
    const app = express();

    await dbConnection()

    await App(app)

    const server = app.listen(config.PORT, console.log(colors.green(`Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.underline)));

    // Handle global unhandled promise rejections
    process.on("unhandledRejection", (err, data) => {
        console.log(`Error: ${err.message}`.red);
        server.close(() => process.exit(1));
    });

}

StartServer();