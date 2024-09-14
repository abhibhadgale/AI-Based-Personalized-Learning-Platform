import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log('PostgreSQL connected');
} catch (error) {
  console.error('PostgreSQL connection error:', error);
}

export default sequelize;
