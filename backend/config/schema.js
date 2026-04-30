const { pgTable, serial, varchar, text, timestamp, integer, json, boolean } = require('drizzle-orm/pg-core');

const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  canAddAdmins: boolean('can_add_admins').default(false),
  canDeleteAdmins: boolean('can_delete_admins').default(false),
  canEditAdmins: boolean('can_edit_admins').default(false),
  canManageAdmins: boolean('can_manage_admins').default(false),
  canManageAnnouncements: boolean('can_manage_announcements').default(false),
  canManageServices: boolean('can_manage_services').default(false),
  canManageCategories: boolean('can_manage_categories').default(false),
  canManageGallery: boolean('can_manage_gallery').default(false),
  canViewDashboard: boolean('can_view_dashboard').default(false),
  messageAccess: varchar('message_access', { length: 50 }).default('None'),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

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
  officerPhotoPublicId: text('officer_photo_public_id'),
  contactPhone: varchar('contact_phone', { length: 100 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  officeNumber: varchar('office_number', { length: 100 }),
  hours: varchar('hours', { length: 255 }),
  additionalDetails: text('additional_details'),
  additionalDetailsAm: text('additional_details_am'),
  bannerPhoto: text('banner_photo'),
  bannerPhotoPublicId: text('banner_photo_public_id'),
});

const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleAm: varchar('title_am', { length: 255 }),
  url: text('url').notNull(),
  publicId: text('public_id'),
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
  messageType: varchar('message_type', { length: 50 }).default('General'),
  serviceCategory: varchar('service_category', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
  admins,
  announcements,
  categories,
  services,
  serviceDetails,
  gallery,
  messages,
};
