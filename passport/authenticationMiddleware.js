function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    
    res.status(403)
    res.end()
  }
}

module.exports = authenticationMiddleware