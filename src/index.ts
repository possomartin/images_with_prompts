import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import indexRouter from './routes/indexRouter.js';
import { parentDir } from './lib/utils.js';

const app = express();
const port = process.env.PORT;
const publicFolder = path.join(parentDir, 'public', 'uploads');

/* path folder */

app.use('/uploads', express.static(publicFolder))

/* middlewares */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(indexRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});