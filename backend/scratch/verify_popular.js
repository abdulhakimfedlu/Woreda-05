// Using builtin fetch (Node v23+)

async function verifyPopularServices() {
  try {
    // 1. Get all services
    const servicesRes = await fetch('http://localhost:5000/api/services');
    const services = await servicesRes.json();
    
    if (services.length === 0) {
      console.log('No services found. Please create one first.');
      return;
    }
    
    const serviceId = services[0].id;
    console.log(`Toggling service ID ${serviceId} to popular...`);
    
    // 2. Toggle one as popular
    // We need to bypass auth or use a token. Since I'm testing locally, I'll check if I can just use a script to update the DB directly.
    // Wait, the routes have authMiddleware. I'll use drizzle directly in the script.
    
    const db = require('../config/db');
    const { services: servicesTable } = require('../config/schema');
    const { eq } = require('drizzle-orm');
    
    await db.update(servicesTable)
      .set({ isPopular: true })
      .where(eq(servicesTable.id, serviceId));
    
    console.log(`Service ${serviceId} set to popular in DB.`);
    
    // 3. Fetch popular services via API
    const popularRes = await fetch('http://localhost:5000/api/services/popular');
    const popularServices = await popularRes.json();
    
    const isFound = popularServices.some(s => s.id === serviceId);
    if (isFound) {
      console.log('SUCCESS: Popular service found in /api/services/popular');
    } else {
      console.log('FAILURE: Popular service NOT found in /api/services/popular');
    }
    
    // 4. Toggle back (cleanup)
    await db.update(servicesTable)
      .set({ isPopular: false })
      .where(eq(servicesTable.id, serviceId));
    console.log('Cleanup: Service toggled back to normal.');

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    process.exit(0);
  }
}

verifyPopularServices();
