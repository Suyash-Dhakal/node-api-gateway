// import dotenv from 'dotenv';
// dotenv.config();
import express from 'express';
import { sequelize } from './config/dbConfig.js';
import { User } from './src/models/user.js'; // this is imported to ensure the model is registered
import { router as authRoutes } from './src/routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

const setupDatabaseAssociation = async () => {
    // associations
    await sequelize.sync();
    console.log("Database synchronized ..");
}

setupDatabaseAssociation().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


