import { app } from './server/express/settings';

require('dotenv').config();

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log(`listen on port : ${port}`);
});
