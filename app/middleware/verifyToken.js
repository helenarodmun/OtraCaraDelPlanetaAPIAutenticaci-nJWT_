exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) return res.status(401).send("Acceso denegado.");
  
    jwt.verify(token, conf.TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(400).send("Token inválido.");
      req.usuario = decoded;
      next();
    });
  };