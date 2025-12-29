import { Router } from 'express';
import { query } from '../database.js';
import { authMiddleware } from '../middleware.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Triage Records
router.get('/triage-records', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM triage_records ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get triage records error:', error);
        res.json([]);
    }
});
// Create Triage Record
router.post('/triage-records', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { patient_id, patient_name, triage_nurse_id, triage_nurse_name, arrival_time, chief_complaint, severity_level, priority_score, symptoms, allergies, current_medications, pain_level, consciousness_level, triage_notes, status, } = req.body;
        if (!patient_id || !chief_complaint || !severity_level) {
            res.status(400).json({ error: 'Patient ID, chief complaint, and severity level required' });
            return;
        }
        const id = uuidv4();
        const result = await query(`INSERT INTO triage_records (
        id, patient_id, patient_name, triage_nurse_id, triage_nurse_name,
        arrival_time, chief_complaint, severity_level, priority_score,
        symptoms, allergies, current_medications, pain_level,
        consciousness_level, triage_notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            patient_id,
            patient_name || null,
            triage_nurse_id || null,
            triage_nurse_name || null,
            arrival_time || new Date().toISOString(),
            chief_complaint,
            severity_level,
            priority_score || null,
            JSON.stringify(symptoms || {}),
            allergies || null,
            current_medications || null,
            pain_level || null,
            consciousness_level || null,
            triage_notes || null,
            status || 'pending',
            new Date().toISOString(),
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create triage record error:', error);
        res.status(500).json({ error: 'Failed to create triage record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Update Triage Record
router.put('/triage-records/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { patient_id, patient_name, triage_nurse_id, triage_nurse_name, arrival_time, chief_complaint, severity_level, priority_score, symptoms, allergies, current_medications, pain_level, consciousness_level, triage_notes, status, } = req.body;
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (patient_id !== undefined) {
            updates.push(`patient_id = $${paramCount++}`);
            values.push(patient_id);
        }
        if (patient_name !== undefined) {
            updates.push(`patient_name = $${paramCount++}`);
            values.push(patient_name);
        }
        if (triage_nurse_id !== undefined) {
            updates.push(`triage_nurse_id = $${paramCount++}`);
            values.push(triage_nurse_id);
        }
        if (triage_nurse_name !== undefined) {
            updates.push(`triage_nurse_name = $${paramCount++}`);
            values.push(triage_nurse_name);
        }
        if (arrival_time !== undefined) {
            updates.push(`arrival_time = $${paramCount++}`);
            values.push(arrival_time);
        }
        if (chief_complaint !== undefined) {
            updates.push(`chief_complaint = $${paramCount++}`);
            values.push(chief_complaint);
        }
        if (severity_level !== undefined) {
            updates.push(`severity_level = $${paramCount++}`);
            values.push(severity_level);
        }
        if (priority_score !== undefined) {
            updates.push(`priority_score = $${paramCount++}`);
            values.push(priority_score);
        }
        if (symptoms !== undefined) {
            updates.push(`symptoms = $${paramCount++}`);
            values.push(JSON.stringify(symptoms));
        }
        if (allergies !== undefined) {
            updates.push(`allergies = $${paramCount++}`);
            values.push(allergies);
        }
        if (current_medications !== undefined) {
            updates.push(`current_medications = $${paramCount++}`);
            values.push(current_medications);
        }
        if (pain_level !== undefined) {
            updates.push(`pain_level = $${paramCount++}`);
            values.push(pain_level);
        }
        if (consciousness_level !== undefined) {
            updates.push(`consciousness_level = $${paramCount++}`);
            values.push(consciousness_level);
        }
        if (triage_notes !== undefined) {
            updates.push(`triage_notes = $${paramCount++}`);
            values.push(triage_notes);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
        }
        if (updates.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }
        updates.push(`updated_at = $${paramCount++}`);
        values.push(new Date().toISOString());
        values.push(req.params.id);
        const result = await query(`UPDATE triage_records SET ${updates.join(', ')}
       WHERE id = $${paramCount}`, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Triage record not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update triage record error:', error);
        res.status(500).json({ error: 'Failed to update triage record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Delete Triage Record
router.delete('/triage-records/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const result = await query('DELETE FROM triage_records WHERE id = ?', [req.params.id]);
        res.json({ success: true, id: req.params.id });
    }
    catch (error) {
        console.error('Delete triage record error:', error);
        res.status(500).json({ error: 'Failed to delete triage record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Vital Signs
router.get('/vital-signs', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM vital_signs ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get vital signs error:', error);
        res.json([]);
    }
});
// Imaging Studies
router.get('/imaging', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM imaging_studies ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get imaging studies error:', error);
        res.json([]);
    }
});
router.post('/imaging', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, study_type, modality, body_part, indication, ordering_doctor, radiologist, study_date, priority, status, report, findings, impression } = req.body;
        if (!patient_id || !study_type) {
            res.status(400).json({ error: 'Missing required fields: patient_id, study_type' });
            return;
        }
        const result = await query(`INSERT INTO imaging_studies (patient_id, patient_name, study_type, modality, body_part, indication, ordering_doctor, radiologist, study_date, priority, status, report, findings, impression)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [patient_id, patient_name || '', study_type, modality || '', body_part || '', indication || '', ordering_doctor || '', radiologist || '', study_date || new Date().toISOString().split('T')[0], priority || 'routine', status || 'scheduled', report || '', findings || '', impression || '']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create imaging study error:', error);
        res.status(500).json({ error: 'Failed to create imaging study', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/imaging/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, patient_name, study_type, modality, body_part, indication, ordering_doctor, radiologist, study_date, priority, status, report, findings, impression } = req.body;
        const existing = await query('SELECT * FROM imaging_studies WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Imaging study not found' });
            return;
        }
        const result = await query(`UPDATE imaging_studies SET patient_id = ?, patient_name = ?, study_type = ?, modality = ?, body_part = ?, indication = ?, ordering_doctor = ?, radiologist = ?, study_date = ?, priority = ?, status = ?, report = ?, findings = ?, impression = ?, updated_at = NOW() WHERE id = ?`, [patient_id ?? existing.rows[0].patient_id, patient_name ?? existing.rows[0].patient_name, study_type ?? existing.rows[0].study_type, modality ?? existing.rows[0].modality, body_part ?? existing.rows[0].body_part, indication ?? existing.rows[0].indication, ordering_doctor ?? existing.rows[0].ordering_doctor, radiologist ?? existing.rows[0].radiologist, study_date ?? existing.rows[0].study_date, priority ?? existing.rows[0].priority, status ?? existing.rows[0].status, report ?? existing.rows[0].report, findings ?? existing.rows[0].findings, impression ?? existing.rows[0].impression, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update imaging study error:', error);
        res.status(500).json({ error: 'Failed to update imaging study', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/imaging/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM imaging_studies WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Imaging study not found' });
            return;
        }
        const result = await query('DELETE FROM imaging_studies WHERE id = ?', [id]);
        res.json({ success: true, message: 'Imaging study deleted successfully', data: { id } });
    }
    catch (error) {
        console.error('Delete imaging study error:', error);
        res.status(500).json({ error: 'Failed to delete imaging study', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Antenatal Visits
router.get('/antenatal', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM antenatal_visits ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get antenatal visits error:', error);
        res.json([]);
    }
});
router.post('/antenatal', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, visit_number, gestational_age, lmp_date, edd_date, fundal_height, fetal_heart_rate, blood_pressure, weight, urine_test, hemoglobin, complaints, examination_findings, advice, next_visit_date, risk_factors, status } = req.body;
        if (!patient_id) {
            res.status(400).json({ error: 'Missing required field: patient_id' });
            return;
        }
        const result = await query(`INSERT INTO antenatal_visits (patient_id, patient_name, visit_number, gestational_age, lmp_date, edd_date, fundal_height, fetal_heart_rate, blood_pressure, weight, urine_test, hemoglobin, complaints, examination_findings, advice, next_visit_date, risk_factors, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [patient_id, patient_name || '', visit_number || 1, gestational_age || 0, lmp_date || null, edd_date || null, fundal_height || 0, fetal_heart_rate || 0, blood_pressure || '', weight || 0, urine_test || '', hemoglobin || 0, complaints || '', examination_findings || '', advice || '', next_visit_date || null, risk_factors || '', status || 'completed']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create antenatal visit error:', error);
        res.status(500).json({ error: 'Failed to create antenatal visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/antenatal/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { visit_number, gestational_age, lmp_date, edd_date, fundal_height, fetal_heart_rate, blood_pressure, weight, urine_test, hemoglobin, complaints, examination_findings, advice, next_visit_date, risk_factors, status } = req.body;
        const existing = await query('SELECT * FROM antenatal_visits WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Antenatal visit not found' });
            return;
        }
        const result = await query(`UPDATE antenatal_visits SET visit_number = ?, gestational_age = ?, lmp_date = ?, edd_date = ?, fundal_height = ?, fetal_heart_rate = ?, blood_pressure = ?, weight = ?, urine_test = ?, hemoglobin = ?, complaints = ?, examination_findings = ?, advice = ?, next_visit_date = ?, risk_factors = ?, status = ?, updated_at = NOW() WHERE id = ?`, [visit_number ?? existing.rows[0].visit_number, gestational_age ?? existing.rows[0].gestational_age, lmp_date ?? existing.rows[0].lmp_date, edd_date ?? existing.rows[0].edd_date, fundal_height ?? existing.rows[0].fundal_height, fetal_heart_rate ?? existing.rows[0].fetal_heart_rate, blood_pressure ?? existing.rows[0].blood_pressure, weight ?? existing.rows[0].weight, urine_test ?? existing.rows[0].urine_test, hemoglobin ?? existing.rows[0].hemoglobin, complaints ?? existing.rows[0].complaints, examination_findings ?? existing.rows[0].examination_findings, advice ?? existing.rows[0].advice, next_visit_date ?? existing.rows[0].next_visit_date, risk_factors ?? existing.rows[0].risk_factors, status ?? existing.rows[0].status, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update antenatal visit error:', error);
        res.status(500).json({ error: 'Failed to update antenatal visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/antenatal/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM antenatal_visits WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Antenatal visit not found' });
            return;
        }
        const result = await query('DELETE FROM antenatal_visits WHERE id = ?', [id]);
        res.json({ success: true, message: 'Antenatal visit deleted successfully', data: { id } });
    }
    catch (error) {
        console.error('Delete antenatal visit error:', error);
        res.status(500).json({ error: 'Failed to delete antenatal visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Surgeries
router.get('/surgeries', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM surgeries ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get surgeries error:', error);
        res.json([]);
    }
});
router.post('/surgeries', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, surgery_type, procedure_name, surgeon_name, anesthesiologist, scheduled_date, duration_minutes, surgery_notes, pre_op_diagnosis, post_op_diagnosis, complications, blood_loss, status, priority, operating_room } = req.body;
        if (!patient_id || !surgery_type) {
            res.status(400).json({ error: 'Missing required fields: patient_id, surgery_type' });
            return;
        }
        const result = await query(`INSERT INTO surgeries (patient_id, patient_name, surgery_type, procedure_name, surgeon_name, anesthesiologist, scheduled_date, duration_minutes, surgery_notes, pre_op_diagnosis, post_op_diagnosis, complications, blood_loss, status, priority, operating_room)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [patient_id, patient_name || '', surgery_type, procedure_name || '', surgeon_name || '', anesthesiologist || '', scheduled_date || new Date().toISOString(), duration_minutes || 0, surgery_notes || '', pre_op_diagnosis || '', post_op_diagnosis || '', complications || '', blood_loss || 0, status || 'scheduled', priority || 'elective', operating_room || '']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create surgery error:', error);
        res.status(500).json({ error: 'Failed to create surgery', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/surgeries/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { surgery_type, procedure_name, surgeon_name, anesthesiologist, scheduled_date, duration_minutes, surgery_notes, pre_op_diagnosis, post_op_diagnosis, complications, blood_loss, status, priority, operating_room } = req.body;
        const existing = await query('SELECT * FROM surgeries WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Surgery not found' });
            return;
        }
        const result = await query(`UPDATE surgeries SET surgery_type = ?, procedure_name = ?, surgeon_name = ?, anesthesiologist = ?, scheduled_date = ?, duration_minutes = ?, surgery_notes = ?, pre_op_diagnosis = ?, post_op_diagnosis = ?, complications = ?, blood_loss = ?, status = ?, priority = ?, operating_room = ?, updated_at = NOW() WHERE id = ?`, [surgery_type ?? existing.rows[0].surgery_type, procedure_name ?? existing.rows[0].procedure_name, surgeon_name ?? existing.rows[0].surgeon_name, anesthesiologist ?? existing.rows[0].anesthesiologist, scheduled_date ?? existing.rows[0].scheduled_date, duration_minutes ?? existing.rows[0].duration_minutes, surgery_notes ?? existing.rows[0].surgery_notes, pre_op_diagnosis ?? existing.rows[0].pre_op_diagnosis, post_op_diagnosis ?? existing.rows[0].post_op_diagnosis, complications ?? existing.rows[0].complications, blood_loss ?? existing.rows[0].blood_loss, status ?? existing.rows[0].status, priority ?? existing.rows[0].priority, operating_room ?? existing.rows[0].operating_room, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update surgery error:', error);
        res.status(500).json({ error: 'Failed to update surgery', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/surgeries/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM surgeries WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Surgery not found' });
            return;
        }
        const result = await query('DELETE FROM surgeries WHERE id = ?', [id]);
        res.json({ success: true, message: 'Surgery deleted successfully', data: { id } });
    }
    catch (error) {
        console.error('Delete surgery error:', error);
        res.status(500).json({ error: 'Failed to delete surgery', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Vaccinations
router.get('/vaccinations', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM vaccinations ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get vaccinations error:', error);
        res.json([]);
    }
});
router.post('/vaccinations', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, vaccine_name, vaccine_type, dose_number, batch_number, manufacturer, site, route, administered_by, administered_date, next_dose_date, adverse_reactions, status } = req.body;
        if (!patient_id || !vaccine_name) {
            res.status(400).json({ error: 'Missing required fields: patient_id, vaccine_name' });
            return;
        }
        const result = await query(`INSERT INTO vaccinations (patient_id, patient_name, vaccine_name, vaccine_type, dose_number, batch_number, manufacturer, site, route, administered_by, administered_date, next_dose_date, adverse_reactions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [patient_id, patient_name || '', vaccine_name, vaccine_type || '', dose_number || 1, batch_number || '', manufacturer || '', site || '', route || '', administered_by || '', administered_date || new Date().toISOString(), next_dose_date || null, adverse_reactions || '', status || 'completed']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create vaccination error:', error);
        res.status(500).json({ error: 'Failed to create vaccination', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/vaccinations/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { vaccine_type, dose_number, batch_number, manufacturer, site, route, administered_by, administered_date, next_dose_date, adverse_reactions, status } = req.body;
        const existing = await query('SELECT * FROM vaccinations WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Vaccination not found' });
            return;
        }
        const result = await query(`UPDATE vaccinations SET vaccine_type = ?, dose_number = ?, batch_number = ?, manufacturer = ?, site = ?, route = ?, administered_by = ?, administered_date = ?, next_dose_date = ?, adverse_reactions = ?, status = ?, updated_at = NOW() WHERE id = ?`, [vaccine_type ?? existing.rows[0].vaccine_type, dose_number ?? existing.rows[0].dose_number, batch_number ?? existing.rows[0].batch_number, manufacturer ?? existing.rows[0].manufacturer, site ?? existing.rows[0].site, route ?? existing.rows[0].route, administered_by ?? existing.rows[0].administered_by, administered_date ?? existing.rows[0].administered_date, next_dose_date ?? existing.rows[0].next_dose_date, adverse_reactions ?? existing.rows[0].adverse_reactions, status ?? existing.rows[0].status, id]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update vaccination error:', error);
        res.status(500).json({ error: 'Failed to update vaccination', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/vaccinations/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM vaccinations WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Vaccination not found' });
            return;
        }
        const result = await query('DELETE FROM vaccinations WHERE id = ?', [id]);
        res.json({ success: true, message: 'Vaccination deleted successfully', data: { id } });
    }
    catch (error) {
        console.error('Delete vaccination error:', error);
        res.status(500).json({ error: 'Failed to delete vaccination', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Lab Tests
router.get('/lab-tests', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM lab_tests ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get lab tests error:', error);
        res.json([]);
    }
});
router.post('/lab-tests', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, test_name, test_type, test_category, sample_type, sample_collected_date, ordered_by, ordered_date, status, notes } = req.body;
        if (!patient_id || !test_name) {
            res.status(400).json({ error: 'Missing required fields: patient_id, test_name' });
            return;
        }
        const result = await query(`INSERT INTO lab_tests (patient_id, patient_name, test_name, test_type, test_category, sample_type, sample_collected_date, ordered_by, ordered_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [patient_id, patient_name || '', test_name, test_type || '', test_category || '', sample_type || '', sample_collected_date || null, ordered_by || '', ordered_date || new Date().toISOString().split('T')[0], status || 'pending', notes || '']);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create lab test error:', error);
        res.status(500).json({ error: 'Failed to create lab test', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/lab-tests/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, patient_name, test_name, test_type, test_category, sample_type, sample_collected_date, ordered_by, ordered_date, status, notes, technician_name, result_values, reference_range, interpretation } = req.body;
        const existing = await query('SELECT * FROM lab_tests WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Lab test not found' });
            return;
        }
        const result = await query(`UPDATE lab_tests SET patient_id = ?, patient_name = ?, test_name = ?, test_type = ?, test_category = ?, sample_type = ?, sample_collected_date = ?, ordered_by = ?, ordered_date = ?, status = ?, notes = ?, technician_name = ?, result_values = ?, reference_range = ?, interpretation = ?, updated_at = NOW() WHERE id = ?`, [
            patient_id ?? existing.rows[0].patient_id,
            patient_name ?? existing.rows[0].patient_name,
            test_name ?? existing.rows[0].test_name,
            test_type ?? existing.rows[0].test_type,
            test_category ?? existing.rows[0].test_category,
            sample_type ?? existing.rows[0].sample_type,
            sample_collected_date ?? existing.rows[0].sample_collected_date,
            ordered_by ?? existing.rows[0].ordered_by,
            ordered_date ?? existing.rows[0].ordered_date,
            status ?? existing.rows[0].status,
            notes ?? existing.rows[0].notes,
            technician_name ?? existing.rows[0].technician_name,
            result_values ?? existing.rows[0].result_values,
            reference_range ?? existing.rows[0].reference_range,
            interpretation ?? existing.rows[0].interpretation,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update lab test error:', error);
        res.status(500).json({ error: 'Failed to update lab test', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/lab-tests/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM lab_tests WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Lab test not found' });
            return;
        }
        const result = await query('DELETE FROM lab_tests WHERE id = ?', [id]);
        res.json({ success: true, message: 'Lab test deleted successfully', data: { id } });
    }
    catch (error) {
        console.error('Delete lab test error:', error);
        res.status(500).json({ error: 'Failed to delete lab test', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Prescriptions
router.get('/prescriptions', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM prescriptions ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get prescriptions error:', error);
        res.json([]);
    }
});
router.post('/prescriptions', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_id, doctor_name, medication_name, dosage, frequency, duration, quantity, instructions, refills, prescribed_date, status } = req.body;
        if (!patient_id || !medication_name) {
            res.status(400).json({ error: 'Missing required fields: patient_id, medication_name' });
            return;
        }
        const result = await query(`INSERT INTO prescriptions (
        patient_id, patient_name, doctor_id, doctor_name, medication_name, dosage,
        frequency, duration, quantity, instructions, refills, prescribed_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patient_id,
            patient_name || '',
            doctor_id || null,
            doctor_name || '',
            medication_name,
            dosage || '',
            frequency || '',
            duration || '',
            quantity || 0,
            instructions || '',
            refills || 0,
            prescribed_date || new Date().toISOString(),
            status || 'active'
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({ error: 'Failed to create prescription', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/prescriptions/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, patient_name, doctor_id, doctor_name, medication_name, dosage, frequency, duration, quantity, instructions, refills, prescribed_date, status } = req.body;
        const existing = await query('SELECT * FROM prescriptions WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Prescription not found' });
            return;
        }
        const result = await query(`UPDATE prescriptions SET
        patient_id = ?,
        patient_name = ?,
        doctor_id = ?,
        doctor_name = ?,
        medication_name = ?,
        dosage = ?,
        frequency = ?,
        duration = ?,
        quantity = ?,
        instructions = ?,
        refills = ?,
        prescribed_date = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            patient_id ?? existing.rows[0].patient_id,
            patient_name ?? existing.rows[0].patient_name,
            doctor_id ?? existing.rows[0].doctor_id,
            doctor_name ?? existing.rows[0].doctor_name,
            medication_name ?? existing.rows[0].medication_name,
            dosage ?? existing.rows[0].dosage,
            frequency ?? existing.rows[0].frequency,
            duration ?? existing.rows[0].duration,
            quantity ?? existing.rows[0].quantity,
            instructions ?? existing.rows[0].instructions,
            refills ?? existing.rows[0].refills,
            prescribed_date ?? existing.rows[0].prescribed_date,
            status ?? existing.rows[0].status,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update prescription error:', error);
        res.status(500).json({ error: 'Failed to update prescription', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Inventory
router.get('/inventory', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM inventory ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get inventory error:', error);
        res.json([]);
    }
});
router.post('/inventory', authMiddleware, async (req, res) => {
    try {
        const { name, sku, category, type, current_stock, min_stock_level, max_stock_level, unit, unit_price, supplier, location, expiry_date, batch_number, status, description } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Missing required field: name' });
            return;
        }
        const result = await query(`INSERT INTO inventory (
        name, sku, category, type, current_stock, min_stock_level, max_stock_level,
        unit, unit_price, supplier, location, expiry_date, batch_number, status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            name,
            sku || null,
            category || '',
            type || '',
            current_stock || 0,
            min_stock_level || 10,
            max_stock_level || null,
            unit || 'units',
            unit_price || 0,
            supplier || '',
            location || '',
            expiry_date || null,
            batch_number || '',
            status || 'available',
            description || ''
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create inventory error:', error);
        res.status(500).json({ error: 'Failed to create inventory item', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/inventory/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, category, type, current_stock, min_stock_level, max_stock_level, unit, unit_price, supplier, location, expiry_date, batch_number, status, description } = req.body;
        const existing = await query('SELECT * FROM inventory WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Inventory item not found' });
            return;
        }
        const result = await query(`UPDATE inventory SET
        name = ?,
        sku = ?,
        category = ?,
        type = ?,
        current_stock = ?,
        min_stock_level = ?,
        max_stock_level = ?,
        unit = ?,
        unit_price = ?,
        supplier = ?,
        location = ?,
        expiry_date = ?,
        batch_number = ?,
        status = ?,
        description = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            name ?? existing.rows[0].name,
            sku ?? existing.rows[0].sku,
            category ?? existing.rows[0].category,
            type ?? existing.rows[0].type,
            current_stock ?? existing.rows[0].current_stock,
            min_stock_level ?? existing.rows[0].min_stock_level,
            max_stock_level ?? existing.rows[0].max_stock_level,
            unit ?? existing.rows[0].unit,
            unit_price ?? existing.rows[0].unit_price,
            supplier ?? existing.rows[0].supplier,
            location ?? existing.rows[0].location,
            expiry_date ?? existing.rows[0].expiry_date,
            batch_number ?? existing.rows[0].batch_number,
            status ?? existing.rows[0].status,
            description ?? existing.rows[0].description,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ error: 'Failed to update inventory item', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/inventory/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM inventory WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Inventory item not found' });
            return;
        }
        const result = await query('DELETE FROM inventory WHERE id = ?', [id]);
        res.json({ message: 'Inventory item deleted successfully', deleted: result.rows[0] });
    }
    catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({ error: 'Failed to delete inventory item', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Dispensing Records
router.get('/dispensing', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM dispensing_records ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get dispensing records error:', error);
        res.json([]);
    }
});
router.post('/dispensing', authMiddleware, async (req, res) => {
    try {
        const { medication_id, medication_name, quantity_dispensed, quantity, dispensed_date, dispensed_by, dispensed_by_name, patient_name, sku, unit_price, total_amount, prescription_id, notes } = req.body;
        // Use quantity_dispensed if provided, otherwise use quantity
        const finalQuantity = quantity_dispensed || quantity;
        if (!medication_name || !finalQuantity) {
            res.status(400).json({ error: 'Missing required fields: medication_name, quantity_dispensed (or quantity)' });
            return;
        }
        const result = await query(`INSERT INTO dispensing_records (medication_id, medication_name, quantity, dispensed_date, dispensed_by, dispensed_by_name, patient_name, sku, unit_price, total_amount, prescription_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            medication_id || null,
            medication_name,
            finalQuantity,
            dispensed_date || new Date().toISOString(),
            dispensed_by || null,
            dispensed_by_name || null,
            patient_name || null,
            sku || null,
            unit_price || 0,
            total_amount || 0,
            prescription_id || null,
            notes || ''
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create dispensing record error:', error);
        res.status(500).json({ error: 'Failed to create dispensing record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/dispensing/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { medication_id, medication_name, quantity_dispensed, quantity, dispensed_date, dispensed_by, dispensed_by_name, patient_name, sku, unit_price, total_amount, prescription_id, notes } = req.body;
        const existing = await query('SELECT * FROM dispensing_records WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Dispensing record not found' });
            return;
        }
        // Use quantity_dispensed if provided, otherwise use quantity
        const finalQuantity = quantity_dispensed ?? quantity ?? existing.rows[0].quantity;
        const result = await query(`UPDATE dispensing_records SET 
        medication_id = ?, 
        medication_name = ?, 
        quantity = ?, 
        dispensed_date = ?, 
        dispensed_by = ?, 
        dispensed_by_name = ?,
        patient_name = ?,
        sku = ?,
        unit_price = ?,
        total_amount = ?,
        prescription_id = ?,
        notes = ?,
        updated_at = NOW() 
       WHERE id = ?`, [
            medication_id ?? existing.rows[0].medication_id,
            medication_name ?? existing.rows[0].medication_name,
            finalQuantity,
            dispensed_date ?? existing.rows[0].dispensed_date,
            dispensed_by ?? existing.rows[0].dispensed_by,
            dispensed_by_name ?? existing.rows[0].dispensed_by_name,
            patient_name ?? existing.rows[0].patient_name,
            sku ?? existing.rows[0].sku,
            unit_price ?? existing.rows[0].unit_price,
            total_amount ?? existing.rows[0].total_amount,
            prescription_id ?? existing.rows[0].prescription_id,
            notes ?? existing.rows[0].notes,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update dispensing record error:', error);
        res.status(500).json({ error: 'Failed to update dispensing record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/dispensing/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await query('SELECT * FROM dispensing_records WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Dispensing record not found' });
            return;
        }
        const result = await query('DELETE FROM dispensing_records WHERE id = ?', [id]);
        res.json({ success: true, message: 'Dispensing record deleted successfully', data: result.rows[0] });
    }
    catch (error) {
        console.error('Delete dispensing record error:', error);
        res.status(500).json({ error: 'Failed to delete dispensing record', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Payments
router.get('/payments', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM payments ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get payments error:', error);
        res.json([]);
    }
});
router.post('/payments', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, amount, currency, payment_method, payment_date, description, invoice_id, status, reference_number } = req.body;
        if (!patient_id || !amount) {
            res.status(400).json({ error: 'Missing required fields: patient_id, amount' });
            return;
        }
        const result = await query(`INSERT INTO payments (
        patient_id, patient_name, amount, currency, payment_method, payment_date,
        description, invoice_id, status, reference_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patient_id,
            patient_name || '',
            amount,
            currency || 'UGX',
            payment_method || '',
            payment_date || new Date().toISOString(),
            description || '',
            invoice_id || null,
            status || 'completed',
            reference_number || ''
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ error: 'Failed to create payment', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/payments/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, patient_name, amount, currency, payment_method, payment_date, description, invoice_id, status, reference_number } = req.body;
        const existing = await query('SELECT * FROM payments WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Payment not found' });
            return;
        }
        const result = await query(`UPDATE payments SET
        patient_id = ?,
        patient_name = ?,
        amount = ?,
        currency = ?,
        payment_method = ?,
        payment_date = ?,
        description = ?,
        invoice_id = ?,
        status = ?,
        reference_number = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            patient_id ?? existing.rows[0].patient_id,
            patient_name ?? existing.rows[0].patient_name,
            amount ?? existing.rows[0].amount,
            currency ?? existing.rows[0].currency,
            payment_method ?? existing.rows[0].payment_method,
            payment_date ?? existing.rows[0].payment_date,
            description ?? existing.rows[0].description,
            invoice_id ?? existing.rows[0].invoice_id,
            status ?? existing.rows[0].status,
            reference_number ?? existing.rows[0].reference_number,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({ error: 'Failed to update payment', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Invoices
router.get('/invoices', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM invoices ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get invoices error:', error);
        res.json([]);
    }
});
router.post('/invoices', authMiddleware, async (req, res) => {
    try {
        const { patient_id, patient_name, invoice_number, invoice_date, due_date, items, subtotal, tax, discount, total, amount_paid, balance, currency, status, notes } = req.body;
        if (!patient_id || !invoice_number || !total) {
            res.status(400).json({ error: 'Missing required fields: patient_id, invoice_number, total' });
            return;
        }
        const result = await query(`INSERT INTO invoices (
        patient_id, patient_name, invoice_number, invoice_date, due_date, items,
        subtotal, tax, discount, total, amount_paid, balance, currency, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patient_id,
            patient_name || '',
            invoice_number,
            invoice_date || new Date().toISOString(),
            due_date || new Date().toISOString().split('T')[0],
            items ? JSON.stringify(items) : null,
            subtotal || 0,
            tax || 0,
            discount || 0,
            total,
            amount_paid || 0,
            balance || total,
            currency || 'UGX',
            status || 'pending',
            notes || ''
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Failed to create invoice', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/invoices/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, patient_name, invoice_number, invoice_date, due_date, items, subtotal, tax, discount, total, amount_paid, balance, currency, status, notes } = req.body;
        const existing = await query('SELECT * FROM invoices WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Invoice not found' });
            return;
        }
        const result = await query(`UPDATE invoices SET
        patient_id = ?,
        patient_name = ?,
        invoice_number = ?,
        invoice_date = ?,
        due_date = ?,
        items = ?,
        subtotal = ?,
        tax = ?,
        discount = ?,
        total = ?,
        amount_paid = ?,
        balance = ?,
        currency = ?,
        status = ?,
        notes = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            patient_id ?? existing.rows[0].patient_id,
            patient_name ?? existing.rows[0].patient_name,
            invoice_number ?? existing.rows[0].invoice_number,
            invoice_date ?? existing.rows[0].invoice_date,
            due_date ?? existing.rows[0].due_date,
            items ? JSON.stringify(items) : existing.rows[0].items,
            subtotal ?? existing.rows[0].subtotal,
            tax ?? existing.rows[0].tax,
            discount ?? existing.rows[0].discount,
            total ?? existing.rows[0].total,
            amount_paid ?? existing.rows[0].amount_paid,
            balance ?? existing.rows[0].balance,
            currency ?? existing.rows[0].currency,
            status ?? existing.rows[0].status,
            notes ?? existing.rows[0].notes,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update invoice error:', error);
        res.status(500).json({ error: 'Failed to update invoice', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Medical Visits
router.get('/medical-visits', authMiddleware, async (req, res) => {
    try {
        const result = await query(`
      SELECT 
        mv.*,
        CAST(mv.visit_date AS DATE) as visit_date,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(d.first_name, ' ', d.last_name) as doctor_name
      FROM medical_visits mv
      LEFT JOIN patients p ON mv.patient_id = p.id
      LEFT JOIN doctors d ON mv.doctor_id = d.id
      ORDER BY mv.created_at DESC LIMIT 100
    `);
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get medical visits error:', error);
        res.json([]);
    }
});
router.post('/medical-visits', authMiddleware, async (req, res) => {
    try {
        const { patient_id, doctor_id, visit_date, visit_type, chief_complaint, diagnosis, treatment_plan, notes, status } = req.body;
        if (!patient_id || !visit_type) {
            res.status(400).json({ error: 'Missing required fields: patient_id, visit_type' });
            return;
        }
        const result = await query(`INSERT INTO medical_visits (
        patient_id, doctor_id, visit_date, visit_type, chief_complaint, 
        diagnosis, treatment_plan, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patient_id,
            doctor_id || null,
            visit_date || new Date().toISOString().split('T')[0],
            visit_type,
            chief_complaint || '',
            diagnosis || '',
            treatment_plan || '',
            notes || '',
            status || 'completed'
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create medical visit error:', error);
        res.status(500).json({ error: 'Failed to create medical visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/medical-visits/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, doctor_id, visit_date, visit_type, chief_complaint, diagnosis, treatment_plan, notes, status } = req.body;
        // Get existing record to preserve fields not being updated
        const existing = await query('SELECT * FROM medical_visits WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Medical visit not found' });
            return;
        }
        const result = await query(`UPDATE medical_visits SET
        patient_id = ?,
        doctor_id = ?,
        visit_date = ?,
        visit_type = ?,
        chief_complaint = ?,
        diagnosis = ?,
        treatment_plan = ?,
        notes = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`, [
            patient_id ?? existing.rows[0].patient_id,
            doctor_id ?? existing.rows[0].doctor_id,
            visit_date ?? existing.rows[0].visit_date,
            visit_type ?? existing.rows[0].visit_type,
            chief_complaint ?? existing.rows[0].chief_complaint,
            diagnosis ?? existing.rows[0].diagnosis,
            treatment_plan ?? existing.rows[0].treatment_plan,
            notes ?? existing.rows[0].notes,
            status ?? existing.rows[0].status,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update medical visit error:', error);
        res.status(500).json({ error: 'Failed to update medical visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.delete('/medical-visits/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if exists
        const existing = await query('SELECT * FROM medical_visits WHERE id = ?', [id]);
        if (existing.rows.length === 0) {
            res.status(404).json({ error: 'Medical visit not found' });
            return;
        }
        await query('DELETE FROM medical_visits WHERE id = ?', [id]);
        res.json({ success: true, message: 'Medical visit deleted successfully' });
    }
    catch (error) {
        console.error('Delete medical visit error:', error);
        res.status(500).json({ error: 'Failed to delete medical visit', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Doctors
router.get('/doctors', authMiddleware, async (req, res) => {
    try {
        const result = await query('SELECT * FROM doctors ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get doctors error:', error);
        res.json([]);
    }
});
export default router;
//# sourceMappingURL=clinical.js.map