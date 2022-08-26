//Chequea que el que hace el request sea un usuario admin o el mismo usuario
module.exports = function (req, res, next) {
  const { user } = req;
  if (!user)
    return res.status(403).send('Acceso denegado. No se encontró el usuario.');

  req.leaveNeighborhood = false;
  const { neighborhood, neighbourId } = req.params;

  if (
    user.admin &&
    user.admin.neighborhoods
      .map((n) => n.toString())
      .includes(neighborhood.toString())
  ) {
    req.adminId = user.admin;
  } else {
    //quiero abandonar el grupo
    if (user.neighbour) {
      for (let neigh of user.neighbour.neighborhoods) {
        if (neigh.toString() === neighborhood) {
          req.leaveNeighborhood = true;

          next();
          return;
        }
      }
      return res
        .status(403)
        .send('Acceso denegado.No tiene permiso para realizar esta accion');
    }
    return res
      .status(403)
      .send('Acceso denegado.No tiene permiso para realizar esta accion');
  }
  next();
};
