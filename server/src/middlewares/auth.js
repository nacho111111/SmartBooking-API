export const auth = (req, res) => {
  
  const { password } = req.body;
  console.log(password)
  console.log(process.env.PASS)
  if (password === process.env.PASS) {
    
    res.cookie('auth_token', process.env.AUTH_TOKEN_VALUE, {
      httpOnly: true,   
      secure: true,    
      sameSite: 'None', 
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10
    });
    return res.json({ message: 'Autorizado' });
  }
  res.status(401).json({ error: 'Clave incorrecta' });
};

export const cookieAuth = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (token === process.env.AUTH_TOKEN_VALUE) {
    next();
  } else {
    res.status(403).json({ error: 'No se ha autorizado este acceso' });
  }
};