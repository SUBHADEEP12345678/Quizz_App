import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import path from 'path'
import { fileURLToPath } from 'url';
/** import connection file */
import connect from './database/conn.js';

const app = express()

//dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** app middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
config();

//Use the client app
app.use(express.static(path.join(__dirname, '/client/build')));
//Render client
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/build/index.html') ));

/** appliation port */
const port = process.env.PORT || 8080;


/** routes */
app.use('/api', router) /** apis */


app.get('/', (req, res) => {
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error)
    }
})


/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to ${window.location.origin}${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})

