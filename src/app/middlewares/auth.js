import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: 'Você precisa estar logado para acessar esta página.' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    req.userIsProvider = decoded.userIsProvider;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Você precisa estar logado para acessar esta página.' });
  }
};
