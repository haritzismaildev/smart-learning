import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/smart_learning',
});

async function createAdminUsers() {
  try {
    console.log('🔐 Creating admin users...\n');

    // 1. Create SuperAdmin
    const superAdminPassword = 'SuperAdmin@2025!';
    const superAdminHash = await bcrypt.hash(superAdminPassword, 10);
    
    await pool.query(`
      INSERT INTO users (full_name, email, password, role, status, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE 
      SET password = $3, role = $4, status = $5
      WHERE users.email = $2
    `, [
      'Super Administrator',
      'superadmin@smartlearning.id',
      superAdminHash,
      'superadmin',
      'active'
    ]);
    
    console.log('✅ SuperAdmin created/updated:');
    console.log('   Email: superadmin@smartlearning.id');
    console.log('   Password: SuperAdmin@2025!');
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');

    // 2. Create Admin
    const adminPassword = 'Admin@2025!';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    
    await pool.query(`
      INSERT INTO users (full_name, email, password, role, status, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE 
      SET password = $3, role = $4, status = $5
      WHERE users.email = $2
    `, [
      'Administrator',
      'admin@smartlearning.id',
      adminHash,
      'admin',
      'active'
    ]);
    
    console.log('✅ Admin created/updated:');
    console.log('   Email: admin@smartlearning.id');
    console.log('   Password: Admin@2025!');
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');

    console.log('🎉 Admin users setup complete!\n');
    console.log('Next steps:');
    console.log('1. Login with the credentials above');
    console.log('2. Immediately change the passwords');
    console.log('3. Test the approval workflow\n');

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    await pool.end();
  }
}

createAdminUsers();