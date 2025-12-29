import { Router } from 'express';
import { query } from '../database.js';
import { authMiddleware } from '../middleware.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Get all patients
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT * FROM patients WHERE clinic_id = ? ORDER BY created_at DESC', [req.user.clinic_id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});
// Get patient by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT * FROM patients WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({ error: 'Failed to fetch patient' });
    }
});
// Create patient
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { first_name, last_name, date_of_birth, gender, phone, email, address, blood_type, allergies, emergency_contact_name, emergency_contact_phone, } = req.body;
        if (!first_name || !last_name) {
            res.status(400).json({ error: 'First and last name required' });
            return;
        }
        const id = uuidv4();
        await query(`INSERT INTO patients (
        id, first_name, last_name, date_of_birth, gender, phone, email, address,
        blood_type, allergies, emergency_contact_name, emergency_contact_phone, clinic_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            first_name,
            last_name,
            date_of_birth || null,
            gender || null,
            phone || null,
            email || null,
            address || null,
            blood_type || null,
            allergies || null,
            emergency_contact_name || null,
            emergency_contact_phone || null,
            req.user.clinic_id,
        ]);
        // Fetch the created patient
        const result = await query('SELECT * FROM patients WHERE id = ?', [id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});
// Update patient
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { first_name, last_name, phone, email, address, blood_type, allergies } = req.body;
        // Check if patient exists first
        const existingResult = await query('SELECT * FROM patients WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        if (existingResult.rows.length === 0) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        await query(`UPDATE patients SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        blood_type = COALESCE(?, blood_type),
        allergies = COALESCE(?, allergies),
        updated_at = NOW()
       WHERE id = ? AND clinic_id = ?`, [
            first_name || null,
            last_name || null,
            phone || null,
            email || null,
            address || null,
            blood_type || null,
            allergies || null,
            req.params.id,
            req.user.clinic_id,
        ]);
        // Fetch the updated patient
        const result = await query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});
// Delete patient
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await query('DELETE FROM patients WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        res.json({ success: true, id: req.params.id });
    }
    catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});
export default router;
//# sourceMappingURL=patients.js.map