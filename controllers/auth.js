
const express =  require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario =  require('../models/Usuario');

const createUser = async (req, res = express.response) => {

  const { name, email, password } = req.body;
   
try {
  let usuario = await Usuario.findOne({email});

  if (usuario) {
    return res.status(400).json({
       ok: false,
       msg: 'Un usuario existe con ese correo'
   });
  }
  usuario = new Usuario(req.body);

  //encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();

  //Generar Token

  const token = await generarJWT(usuario.id, usuario.name);
 
   res.status(201).json({
       ok: true,
       msg: 'registro',
       uid: usuario.id,
       name: usuario.name,
       token
   });
} catch (error) {
  console.log('error');
  res.status(500).json({
       ok: false,
       msg: 'Error creando usuario'
   });
}
}; 

const loginUser = async (req, res = express.response) => {


  const { email, password } = req.body;

   
try {
  const  usuario = await Usuario.findOne({email});

  if (!usuario) {
    return res.status(400).json({
       ok: false,
       msg: 'Email  erroneos'
   });
  }

  //Confirmar password
  const validPassword = bcrypt.compareSync(password, usuario.password);

  if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'password erroneos'
    });
    }

 //Generar Token
 const token = await generarJWT(usuario.id, usuario.name);
 
  
  res.status(200).json({
      ok: true,
      msg: 'loginUser',
      email,
      password,
      token
  });
    
  } catch (error) {
    console.log(error);
  res.status(500).json({
       ok: false,
       msg: 'Error logueando usuario'
   });
  }

}; 

const renewToken = async (req, res = express.response) => {

  const {uid, name} = req;

  const token = await generarJWT ( uid, name);
  
  res.json({
      ok: true,
      token
  });
}; 

module.exports = {
  createUser,
  loginUser,
  renewToken
}