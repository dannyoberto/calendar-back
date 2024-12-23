
/*
    Events Routes
    /api/events

*/
//Estas rutas pasan por la validación de JWT

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEventos } = require( '../controllers/events' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validar-campos' );
const { isDate } = require( '../helpers/isDate' );

const router = Router();

//funcion para indicar que todo se debe validar aqui en el JWT antes de procesar cualquier evento
router.use(validarJWT);

//obtener eventos
router.get('/', getEventos);

//crear eventos
router.post('/',[
  check('title','El titulo es obligatorio').not().isEmpty(),
  check('start','La fecha start es obligatorio').custom(isDate),
  check('end','La fecha end es obligatorio').custom(isDate),
  validarCampos
] ,crearEvento);

//actualziar eventos
router.put('/:id', actualizarEvento);

//eliminar eventos
router.delete('/:id', eliminarEventos);

module.exports = router;