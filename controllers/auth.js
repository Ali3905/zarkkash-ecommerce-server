const jwt = require('jsonwebtoken');

const ADMIN_CREDENTIALS = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
};

async function handleLogin (req, res) {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email, password);
    console.log("Admin credentials:", ADMIN_CREDENTIALS);

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ success: true });
};

async function handleLogout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: 'lax',
    });
    res.status(200).json({ success: true });
};

async function handleCheckAuth (req, res) {
    const token = req?.cookies?.token;
    console.log("Checking auth with token:", req.cookies);
    
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.json({ success: true, data: decoded });
    } catch {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = {
    handleLogin,
    handleLogout,
    handleCheckAuth,
}
