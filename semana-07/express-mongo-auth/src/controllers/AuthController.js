import authService from '../services/AuthService.js';

class AuthController {

    async signUp(req, res, next) {
        try {
            const user = await authService.signUp(req.body);
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const token = await authService.signIn(req.body);
            return res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }

    async emailAvailable(req, res, next) {
        try {
            const available = await authService.isEmailAvailable(req.body?.email);
            return res.status(200).json({ available });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
