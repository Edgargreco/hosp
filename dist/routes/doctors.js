import { Router } from 'express';
import { query } from '../database.js';
import { authMiddleware } from '../middleware.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Get all doctors
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT * FROM doctors WHERE clinic_id = ? ORDER BY created_at DESC', [req.user.clinic_id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});
// Get doctor by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT * FROM doctors WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Doctor not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get doctor error:', error);
        res.status(500).json({ error: 'Failed to fetch doctor' });
    }
});
// Create doctor
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { first_name, last_name, email, phone, specialization, department, license_number, qualification, experience_years, status, consultation_fee, available_days, available_hours, } = req.body;
        if (!first_name || !last_name || !specialization) {
            res.status(400).json({ error: 'First name, last name, and specialization required' });
            return;
        }
        const id = uuidv4();
        // Handle available_days - convert to proper PostgreSQL array format
        let daysArray = [];
        if (available_days) {
            if (Array.isArray(available_days)) {
                daysArray = available_days;
            }
            else if (typeof available_days === 'string') {
                daysArray = JSON.parse(available_days);
            }
        }
        const result = await query(`INSERT INTO doctors (
        id, first_name, last_name, email, phone, specialization, department,
        license_number, qualification, experience_years, status, consultation_fee,
        available_days, available_hours, clinic_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            first_name,
            last_name,
            email || null,
            phone || null,
            specialization,
            department || null,
            license_number || null,
            qualification || null,
            experience_years || 0,
            status || 'active',
            consultation_fee || 0,
            daysArray, // Pass array directly - PostgreSQL will handle it
            available_hours || null,
            req.user.clinic_id,
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create doctor error:', error);
        res.status(500).json({ error: 'Failed to create doctor', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Update doctor
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { first_name, last_name, email, phone, specialization, department, license_number, qualification, experience_years, status, consultation_fee, available_days, available_hours, } = req.body;
        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (first_name !== undefined) {
            updates.push(`first_name = $${paramCount++}`);
            values.push(first_name);
        }
        if (last_name !== undefined) {
            updates.push(`last_name = $${paramCount++}`);
            values.push(last_name);
        }
        if (email !== undefined) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramCount++}`);
            values.push(phone);
        }
        if (specialization !== undefined) {
            updates.push(`specialization = $${paramCount++}`);
            values.push(specialization);
        }
        if (department !== undefined) {
            updates.push(`department = $${paramCount++}`);
            values.push(department);
        }
        if (license_number !== undefined) {
            updates.push(`license_number = $${paramCount++}`);
            values.push(license_number);
        }
        if (qualification !== undefined) {
            updates.push(`qualification = $${paramCount++}`);
            values.push(qualification);
        }
        if (experience_years !== undefined) {
            updates.push(`experience_years = $${paramCount++}`);
            values.push(experience_years);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
        }
        if (consultation_fee !== undefined) {
            updates.push(`consultation_fee = $${paramCount++}`);
            values.push(consultation_fee);
        }
        if (available_days !== undefined) {
            updates.push(`available_days = $${paramCount++}`);
            // Handle available_days - convert to proper PostgreSQL array format
            let daysArray = [];
            if (available_days) {
                if (Array.isArray(available_days)) {
                    daysArray = available_days;
                }
                else if (typeof available_days === 'string') {
                    daysArray = JSON.parse(available_days);
                }
            }
            values.push(daysArray);
        }
        if (available_hours !== undefined) {
            updates.push(`available_hours = $${paramCount++}`);
            values.push(available_hours);
        }
        if (updates.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }
        updates.push(`updated_at = $${paramCount++}`);
        values.push(new Date().toISOString());
        values.push(req.params.id);
        values.push(req.user.clinic_id);
        const result = await query(`UPDATE doctors SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND clinic_id = $${paramCount + 1}`, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Doctor not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update doctor error:', error);
        res.status(500).json({ error: 'Failed to update doctor', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Delete doctor
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await query('DELETE FROM doctors WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        res.json({ success: true, id: req.params.id });
    }
    catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});
export default router;
//# sourceMappingURL=doctors.js.map