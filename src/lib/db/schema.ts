import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, pgEnum, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'in_progress', 'completed']);
export const adminRoleEnum = pgEnum('admin_role', ['hr_admin', 'dev_admin', 'plant_manager']);
export const eventTypeEnum = pgEnum('event_type', ['view_section', 'start_course', 'complete_course']);

// Plants (not tenant-scoped - defines tenants)
export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Profiles (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  jobTitle: text('job_title'),
  status: userStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  plantIdIdx: index('profiles_plant_id_idx').on(table.plantId),
  emailIdx: index('profiles_email_idx').on(table.email),
}));

// Admin Role Assignments
export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: adminRoleEnum('role').notNull(),
  plantId: uuid('plant_id').references(() => plants.id), // null for org-wide admins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userRoleUnique: unique('admin_roles_user_role_plant_unique').on(table.userId, table.role, table.plantId),
  userIdIdx: index('admin_roles_user_id_idx').on(table.userId),
}));

// Courses
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  version: text('version').notNull().default('1.0'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enrollments (tenant-scoped)
export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  status: enrollmentStatusEnum('status').notNull().default('enrolled'),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userCourseUnique: unique('enrollments_user_course_unique').on(table.userId, table.courseId),
  plantCourseIdx: index('enrollments_plant_course_idx').on(table.plantId, table.courseId),
  statusIdx: index('enrollments_status_idx').on(table.status),
}));

// Progress Tracking (tenant-scoped)
export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  progressPercent: integer('progress_percent').notNull().default(0),
  currentSection: text('current_section'),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userCourseUnique: unique('progress_user_course_unique').on(table.userId, table.courseId),
  plantCourseIdx: index('progress_plant_course_idx').on(table.plantId, table.courseId),
}));

// Question Events (append-only analytics, tenant-scoped)
export const questionEvents = pgTable('question_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  sectionKey: text('section_key').notNull(),
  questionKey: text('question_key').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  attemptIndex: integer('attempt_index').notNull().default(1),
  responseMeta: jsonb('response_meta'), // Optional payload for analytics
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  plantCourseQuestionIdx: index('question_events_plant_course_question_idx')
    .on(table.plantId, table.courseId, table.questionKey),
  answeredAtIdx: index('question_events_answered_at_idx').on(table.answeredAt),
  userQuestionIdx: index('question_events_user_question_idx').on(table.userId, table.questionKey),
}));

// Activity Events (optional audit trail, tenant-scoped)
export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  eventType: eventTypeEnum('event_type').notNull(),
  meta: jsonb('meta'), // Additional event data
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  plantCourseEventIdx: index('activity_events_plant_course_event_idx')
    .on(table.plantId, table.courseId, table.eventType),
  occurredAtIdx: index('activity_events_occurred_at_idx').on(table.occurredAt),
  userEventIdx: index('activity_events_user_event_idx').on(table.userId, table.eventType),
}));

// Relations
export const plantsRelations = relations(plants, ({ many }) => ({
  profiles: many(profiles),
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id],
  }),
  adminRoles: many(adminRoles),
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [enrollments.plantId],
    references: [plants.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(profiles, {
    fields: [progress.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [progress.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [progress.plantId],
    references: [plants.id],
  }),
}));

export const questionEventsRelations = relations(questionEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [questionEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [questionEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [questionEvents.plantId],
    references: [plants.id],
  }),
}));

export const activityEventsRelations = relations(activityEvents, ({ one }) => ({
  user: one(profiles, {
    fields: [activityEvents.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [activityEvents.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [activityEvents.plantId],
    references: [plants.id],
  }),
}));

export const adminRolesRelations = relations(adminRoles, ({ one }) => ({
  user: one(profiles, {
    fields: [adminRoles.userId],
    references: [profiles.id],
  }),
  plant: one(plants, {
    fields: [adminRoles.plantId],
    references: [plants.id],
  }),
}));