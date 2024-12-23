const express = require('express');
require('dotenv').config();
const  cors = require('cors')

const { dbConnection} =require('./database/config');

//console.log(process.env);

// se crea el servidor express
const app = express();

//Directorio público
app.use( express.static('public'));
dbConnection();

//CORS
app.use(cors());

//Lectura y parseo  del body
app.use( express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


app.listen(process.env.PORT, () => {
  console.log(' servidor corriendo en puerto 4000');
});