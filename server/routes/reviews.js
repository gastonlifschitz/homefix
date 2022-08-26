const { Review, validate } = require('../models/review');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const express = require('express');
const config = require('config');
const router = express.Router();
const getUser = require('../middleware/getUser');
const { validateCreateReview } = require('../middleware/reviewsMiddlewares');
const { validateSuperAdmin } = require('../middleware/authMiddlewares');

router.get(
  '/',
  /*auth,*/ async (req, res) => {
    await Review.find()
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          res.status(200).json(docs);
        } else {
          res.status(404).json({
            message: 'No se encontraron reseñas'
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);

/** Traer reviews reportadas */
router.get('/report', [auth, validateSuperAdmin], async (req, res, next) => {
  await Review.find({ report: true })
    .sort({ timestamp: 'desc' })
    .exec()
    .then((docs) => {
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: 'No se encontro la reseña a reportar'
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** Eliminar review */
/** NOTE: No estamos usando este endpoint */
router.delete('/:id', [auth, validateSuperAdmin], async (req, res, next) => {
  const { id } = req.params;
  Review.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/** Conseguir una review a partir de un id de empleado */
router.get(
  '/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;
    let reviews = await Review.find({
      _employee: id,
      report: { $ne: true }
    })
      .lean()
      .populate('_employee')
      .populate('_issuer'); /*.populate('_employee')*/
    if (!reviews) return res.status(400).send();

    //res.send(Employee.toGetApiEmployeeSchema(employee, req));
    res.send(reviews);
  }
);

/** Conseguir reviews a partir de un id de neighbour */
router.get(
  '/issuedBy/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;
    let reviews = await Review.find({
      _issuer: id,
      report: { $ne: true }
    })
      .lean()
      .populate('_employee')
      .populate('_issuer')
      .populate('_employee');
    if (!reviews) return res.status(400).send();

    //res.send(Employee.toGetApiEmployeeSchema(employee, req));
    res.send(reviews);
  }
);

/** Conseguir el rating de un empleado */
router.get(
  '/rating/:id',
  /*auth,*/ async (req, res) => {
    const { id } = req.params;
    let reviews = await Review.aggregate([
      // { $unwind: "$review" },
      { $match: { _employee: ObjectId(id), report: { $ne: true } } },
      {
        $group: {
          _id: '$_employee',
          avg: { $avg: '$rating' }
        }
      }
    ]);

    if (!reviews) return res.status(400).send();

    res.send(reviews);
  }
);

/** Generar nueva review*/
router.post(
  '/proposal/:id',
  [auth, getUser, validateCreateReview],
  async (req, res) => {
    const { proposal } = req;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let review = new Review(req.body);

    review._issuer = proposal._receiver;

    await review.save();

    proposal._review = review._id;

    await proposal.save();

    res.status(200).send(review);
  }
);

//Report review
router.patch('/report/:id', auth, async (req, res) => {
  const { id: _id } = req.params;

  let review = await Review.findOne({ _id });
  const { reports } = review;

  if (!reports.includes(req.user._id)) reports.push(req.user._id);
  else {
    res.status(405).json({ alreadyReported: true });
    return;
  }

  if (review.reports.length >= config.get('MIN_REVIEW_REPORT'))
    review.report = true;

  await review.save();
  res.status(200).json(review);
});

//Unreport review
router.patch('/unreport/:id', [auth, validateSuperAdmin], async (req, res) => {
  const { id } = req.params;

  Review.updateOne({ _id: id }, { $set: { report: false, reports: [] } })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/like/:id', [auth, getUser], async (req, res) => {
  const { user, params } = req;
  const { id: _id } = params;
  const { _id: userId, neighbour } = user;

  let review = await Review.findOne({ _id });
  if (!review) return res.status(201).send('No existe la reseña');

  let { likes, disLikes, _issuer } = review;

  if (neighbour && _issuer.equals(neighbour._id))
    return res.status(201).send('Esta reseña no puede ser likeada');

  if (!likes.includes(userId) && !disLikes.includes(userId)) {
    likes.push(userId);
  } else if (likes.includes(userId)) {
    likes.splice(likes.indexOf(userId), 1);
  } else {
    return res
      .status(201)
      .send('No podes likear una reseña que ya deslikeaste');
  }

  await review.save();
  res.status(200).json(review);
});

router.patch('/dislike/:id', [auth, getUser], async (req, res) => {
  const { user, params } = req;
  const { id: _id } = params;
  const { _id: userId, neighbour } = user;

  let review = await Review.findOne({ _id });
  if (!review) return res.status(201).send('No existe la reseña');

  let { likes, disLikes, _issuer } = review;

  if (neighbour && _issuer.equals(neighbour._id))
    return res.status(201).send('Esta reseña no puede ser deslikeada');

  if (!likes.includes(userId) && !disLikes.includes(userId)) {
    disLikes.push(userId);
  } else if (disLikes.includes(userId)) {
    disLikes.splice(disLikes.indexOf(userId), 1);
  } else {
    return res.status(201).send('No podes dislike una reseña que ya likeaste');
  }

  await review.save();
  res.status(200).json(review);
});

module.exports = router;
