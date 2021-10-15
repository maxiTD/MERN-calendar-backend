/* 
    Rutas de usuarios - Auth
    host + /api/auth 
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {createUser, userLogin, tokenRenew} = require('../controllers/auth');
const {fieldsValidate} = require('../middlewares/fieldValidators');
const {validateJWT} = require('../middlewares/jwtValidate');

const router = Router();


router.post('/new',
            [//middlewares
                check('name', 'El nombre es obligatorio').not().isEmpty(),
                check('email', 'El email es obligatorio').not().isEmpty(),
                check('email', 'Revise el email ingresado').isEmail(),
                check('password', 'El password debe tener al menos 6 caracteres').isLength({min:6}),
                fieldsValidate
            ],
            createUser);

router.post('/',
            [//middlewares
                check('email', 'El email es obligatorio').not().isEmpty(),
                check('email', 'Revise el email ingresado').isEmail(),
                check('password', 'El password debe tener al menos 6 caracteres').isLength({min:6}),
                fieldsValidate
            ],
            userLogin);

router.get('/renew', validateJWT , tokenRenew);

module.exports = router; 