import { getSession } from './session';

const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token')
      res.status(401).json({ message: 'Unauthorized, incident has been noted' });
      return;
    }

    const session = await getSession(token);

    if (!session) {
      console.log('No session')
      res.status(401).json({ message: 'Unauthorized, incident has been noted' });
      return;
    }

    req.user = session.user;

    return handler(req, res);
  };
};

export default authMiddleware;