const { Rubro } = require('../models/rubro');
const express = require('express');
const router = express.Router();

router.get(
  '/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;
    let rubros = await Rubro.findById(id);

    res.send(rubros);
  }
);

module.exports = router;
