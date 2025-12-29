import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { verifyConnection } from './database.js';
import authRoutes from './routes/auth.js';
import patientsRoutes from './routes/patients.js';
import doctorsRoutes from './routes/doctors.js';
import appointmentsRoutes from './routes/appointments.js';
import clinicalRoutes from './routes/clinical.js';
const app = express();
// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api', clinicalRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
async function start() {
    try {
        // Verify database connection
        const dbConnected = await verifyConnection();
        if (!dbConnected) {
            process.exit(1);
        }
        app.listen(config.port, () => {
            console.log(`✓ Server running on http://localhost:${config.port}`);
            console.log(`✓ Environment: ${config.nodeEnv}`);
            console.log(`✓ CORS enabled for: ${config.corsOrigin}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();
export default app;
//# sourceMappingURL=index.js.map