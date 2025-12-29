import { Router } from 'express';
import { query } from '../database.js';
import { authMiddleware } from '../middleware.js';
import { generateToken, hashPassword, verifyPassword } from '../auth.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, department, clinic_id } = req.body;
        // Validate input
        if (!email || !password || !name || !role) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Check if user exists
        const existingUser = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.rows.length > 0) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        // Create user
        const result = await query(`INSERT INTO users (id, name, email, password_hash, role, department, clinic_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, true)`, [userId, name, email, hashedPassword, role, department || null, clinic_id || 'main']);
        const user = result.rows[0];
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            clinic_id: user.clinic_id,
        });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }
        const result = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const user = result.rows[0];
        const isPasswordValid = await verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        // Update last login
        await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            clinic_id: user.clinic_id,
        });
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                profile_image: user.profile_image,
                clinic_id: user.clinic_id,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT id, name, email, role, department, clinic_id, profile_image FROM users WHERE id = ?', [req.user.id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { name, profile_image, department } = req.body;
        const result = await query('UPDATE users SET name = COALESCE(?, name), profile_image = COALESCE(?, profile_image), department = COALESCE(?, department), updated_at = NOW() WHERE id = ?', [name || null, profile_image || null, department || null, req.user.id]);
        // MySQL doesn't use RETURNING, so fetch the updated user
        const updatedResult = await query('SELECT id, name, email, role, profile_image, department FROM users WHERE id = ?', [req.user.id]);
        res.json(updatedResult.rows[0]);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map