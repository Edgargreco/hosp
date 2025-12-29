import { Router } from 'express';
import { query } from '../database.js';
import { authMiddleware } from '../middleware.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Get all appointments
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('SELECT * FROM appointments WHERE clinic_id = ? ORDER BY date DESC', [req.user.clinic_id]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
// Create appointment
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { patient_id, patient_name, doctor_id, doctor_name, date, time, type, reason, notes } = req.body;
        if (!patient_id || !doctor_id || !date) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const id = uuidv4();
        const result = await query(`INSERT INTO appointments (
        id, patient_id, patient_name, doctor_id, doctor_name, date, time, type, reason, notes, clinic_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, patient_id, patient_name || '', doctor_id, doctor_name || '', date, time || '', type || 'consultation', reason || '', notes || '', req.user.clinic_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});
// Update appointment
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { date, time, status, notes } = req.body;
        const result = await query(`UPDATE appointments SET 
        date = COALESCE(?, date),
        time = COALESCE(?, time),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        updated_at = NOW()
       WHERE id = ? AND clinic_id = ?`, [date || null, time || null, status || null, notes || null, req.params.id, req.user.clinic_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});
// Delete appointment
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await query('DELETE FROM appointments WHERE id = ? AND clinic_id = ?', [req.params.id, req.user.clinic_id]);
        res.status(204).send();
    }
    catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});
export default router;
//# sourceMappingURL=appointments.js.map