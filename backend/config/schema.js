const { pgTable, serial, varchar, text, timestamp, integer, json } = require('drizzle-orm/pg-core');

const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  status: varchar('status', { length: 50 }).default('Draft'),
  author: varchar('author', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  categoryNumber: integer('category_number').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

const serviceDetails = pgTable('service_details', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').references(() => services.id).unique(),
  description: text('description'),
  requirements: json('requirements'),
  officerName: varchar('officer_name', { length: 255 }),
  officerRole: varchar('officer_role', { length: 255 }),
  officerPhoto: text('officer_photo'),
  contactPhone: varchar('contact_phone', { length: 100 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  officeNumber: varchar('office_number', { length: 100 }),
  hours: varchar('hours', { length: 255 }),
  additionalDetails: text('additional_details'),
});

const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  description: text('description'),
  date: varchar('date', { length: 100 }),
  size: varchar('size', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
  announcements,
  categories,
  services,
  serviceDetails,
  gallery,
};
