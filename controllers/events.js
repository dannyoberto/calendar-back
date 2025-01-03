
const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) => {

  const eventos = await Evento.find()
                              .populate('user','name');



  res.json({
    ok: true,
    eventos
  })
}

const crearEvento = async (req, res = response) => {

  const evento = new Evento( req.body );

  try {
    evento.user = req.uid;
    const eventoGuaradado = await evento.save();
    res.status(200).json({
      ok: true,
      evento: eventoGuaradado
    });
     
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error, hable con el administrador'
    });
  }

  res.json({
    ok: true,
    msg: 'crearEvento'
  })
}

const actualizarEvento = async (req, res = response) => {

  const eventoId = req.params.id;

  try {

    const evento = await Evento.findById( eventoId );
    const uid = req.uid;

    if (!evento) {
      res.status(400).json({
        ok: false,
        msg: 'El evento no existe con ese id'
      });  
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento'
      }); 
    }

    const nuevoEvento  = {
      ...req.body,
      user: uid
    };

    const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true} );

    res.status(200).json({
      ok: true,
      eventoActualizado
    }); 
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error, hable con el adm'
    });
  }

}

const eliminarEventos = async(req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {

      const evento = await Evento.findById( eventoId );

      if ( !evento ) {
          return res.status(404).json({
              ok: false,
              msg: 'Evento no existe por ese id'
          });
      }

      if ( evento.user.toString() !== uid ) {
          return res.status(401).json({
              ok: false,
              msg: 'No tiene privilegio de eliminar este evento'
          });
      }


      await Evento.findByIdAndDelete( eventoId );

      res.json({ ok: true });

      
  } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEventos

}
