import express from 'express';
const app = express();
const PORT = 3321;
import db from './config/db';
import adminRoutes from './routes/adminRoutes';
app.use(express.json());
db();
app.use('/admin', adminRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
