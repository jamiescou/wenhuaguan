exports.checkAuth = function (req, res, next,ctx) {
 
  var token = ctx.session.user;
  if (!token) {
    res.redirect('/user/login');
  } else {
    next();
  }
}