import { app } from './server/express/app';
import { init } from './server/express/init';

import dotenv from 'dotenv';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;

const startApp = () => {
    app.listen(port, () => {
        console.log(`Listen on port : ${port}`);
    });

    init.start().then((r) => (r ? console.log('Initialization was successfully') : console.error('Initialization was rejected')));
};
startApp();
