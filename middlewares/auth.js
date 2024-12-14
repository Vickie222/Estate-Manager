const jwt = require('jsonwebtoken');

const auth = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader){
      return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }
   // const token = req.header('Authorization');
   const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      if (role && req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  };
};

module.exports = auth;
