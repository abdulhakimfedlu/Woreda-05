const bcrypt = require('bcryptjs');
const db = require('./config/db');
const { admins } = require('./config/schema');

async function seedAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Adiadi', salt);

    await db.insert(admins).values({
      username: 'Abdu',
      passwordHash: passwordHash,
      canAddAdmins: true,
      canDeleteAdmins: true,
      canEditAdmins: true,
      canManageAdmins: true,
    }).onConflictDoNothing(); // Prevent error if it already exists

    console.log('Initial admin (Abdu) seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
