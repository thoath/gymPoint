export default async (req, res, next) => {
  if (!req.userIsProvider) {
    return res
      .status(401)
      .json({ error: 'Você precisa estar logado como administrador.' });
  }

  return next();
};
