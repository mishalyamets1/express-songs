const express = require('express');
const router = express.Router();
const controller = require('../controllers/songsController');


router.get('/', controller.getAll);


router.get('/:id', controller.getOne);


router.post('/', controller.addOne);


router.put('/:id', controller.updateOne);


router.delete('/:id', controller.deleteOne);

module.exports = router;
