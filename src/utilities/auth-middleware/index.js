import { getSession } from './session';

const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await getSession(token);

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.user = session.user;

    return handler(req, res);
  };
};

export default authMiddleware;