const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { coords } = require('../models/models')
// const auth = require('../routers/AuthRouters')
const middlewares = require('../middlewares/errors');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const http = require('http');
const WebSocket = require('ws');
require('dotenv').config()

const sequelize = new Sequelize(process.env.MYSQL_DB_NAME, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
});



class Coords extends Model { }
class User extends Model { }


const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    console.log(ws.protocol); // this is token 


    ws.on('message', function incoming(message) {
        jwt.verify(ws.protocol, 'secret_key', async (err, authData) => {
            if (err) {
                console.log(err);
            } else {
                console.log('received: %s' , authData.dd);
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        console.debug('success');
                    }
                });
            }
        })


    })
})


app.get('/coords', async (req, res) => {
    try {
        result = await Coords.init(coords, {
            sequelize,
            modelName: 'coords'
        }).findAll({
            attributes: ['lon', 'lat', 'user_id']
        });
        res.json({
            result: result
        })
    } catch (error) {
        throw error
    }
});

app.get('/users', async (req, res) => {
    try {
        result = await User.init({

        }, {
            sequelize,
            modelName: 'users'
        }).findAll({
            attributes: ['first_name', 'last_name', 'id']
        });
        res.json({
            result: result
        })
    } catch (error) {
        throw error
    }
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

sequelize
    .authenticate()
    .then(() => {
        server.listen(process.env.PORT || 5000, () => {
            console.log(`Server started on port ${server.address().port} :)`);
        });

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


