module.exports = function (req, res, next) {
  const { report } = req.body;
  if (report !== false) return res.status(400).send('Report should be false');

  next();
};
