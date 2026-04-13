const { pgTable, serial, varchar, text, timestamp, integer, json, boolean } = require('drizzle-orm/pg-core');

const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleAm: varchar('title_am', { length: 255 }),
  content: text('content'),
  contentAm: text('content_am'),
  status: varchar('status', { length: 50 }).default('Draft'),
  category: varchar('category', { length: 50 }).default('Urgent'),
  author: varchar('author', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameAm: varchar('name_am', { length: 100 }),
  description: text('description'),
  descriptionAm: text('description_am'),
  categoryNumber: integer('category_number').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleAm: varchar('title_am', { length: 255 }),
  department: varchar('department', { length: 100 }),
  departmentAm: varchar('department_am', { length: 100 }),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

const serviceDetails = pgTable('service_details', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').references(() => services.id).unique(),
  description: text('description'),
  descriptionAm: text('description_am'),
  requirements: json('requirements'),
  requirementsAm: json('requirements_am'),
  officerName: varchar('officer_name', { length: 255 }),
  officerNameAm: varchar('officer_name_am', { length: 255 }),
  officerRole: varchar('officer_role', { length: 255 }),
  officerRoleAm: varchar('officer_role_am', { length: 255 }),
  officerPhoto: text('officer_photo'),
  contactPhone: varchar('contact_phone', { length: 100 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  officeNumber: varchar('office_number', { length: 100 }),
  hours: varchar('hours', { length: 255 }),
  additionalDetails: text('additional_details'),
  additionalDetailsAm: text('additional_details_am'),
  bannerPhoto: text('banner_photo'),
});

const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleAm: varchar('title_am', { length: 255 }),
  url: text('url').notNull(),
  description: text('description'),
  descriptionAm: text('description_am'),
  date: varchar('date', { length: 100 }),
  size: varchar('size', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});

const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  topic: varchar('topic', { length: 255 }).notNull(),
  description: text('description').notNull(),
  contactInfo: varchar('contact_info', { length: 20 }),
  isAnonymous: boolean('is_anonymous').default(false),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
  announcements,
  categories,
  services,
  serviceDetails,
  gallery,
  messages,
};
