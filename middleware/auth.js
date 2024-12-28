const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect('/login');
    req.user = decoded;
    next();
  });
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send('Forbidden');
  next();
};

module.exports = { authenticate, authorize };
