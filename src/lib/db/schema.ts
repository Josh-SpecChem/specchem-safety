import { pgTable, index, foreignKey, uuid, jsonb, timestamp, unique, integer, text, boolean, pgEnum } from "drizzle-orm/pg-core"

export const adminRole = pgEnum("admin_role", ['hr_admin', 'dev_admin', 'plant_manager'])
export const enrollmentStatus = pgEnum("enrollment_status", ['enrolled', 'in_progress', 'completed'])
export const eventType = pgEnum("event_type", ['view_section', 'start_course', 'complete_course'])
export const userStatus = pgEnum("user_status", ['active', 'suspended'])


export const activityEvents = pgTable("activity_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	courseId: uuid("course_id").notNull(),
	plantId: uuid("plant_id").notNull(),
	eventType: eventType("event_type").notNull(),
	meta: jsonb(),
	occurredAt: timestamp("occurred_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activity_events_occurred_at_idx").using("btree", table.occurredAt.asc().nullsLast().op("timestamp_ops")),
	index("activity_events_plant_course_event_idx").using("btree", table.plantId.asc().nullsLast().op("enum_ops"), table.courseId.asc().nullsLast().op("uuid_ops"), table.eventType.asc().nullsLast().op("enum_ops")),
	index("activity_events_user_event_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.eventType.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "activity_events_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "activity_events_plant_id_plants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "activity_events_user_id_profiles_id_fk"
		}).onDelete("cascade"),
]);

export const enrollments = pgTable("enrollments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	courseId: uuid("course_id").notNull(),
	plantId: uuid("plant_id").notNull(),
	status: enrollmentStatus().default('enrolled').notNull(),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("enrollments_plant_course_idx").using("btree", table.plantId.asc().nullsLast().op("uuid_ops"), table.courseId.asc().nullsLast().op("uuid_ops")),
	index("enrollments_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "enrollments_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "enrollments_plant_id_plants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "enrollments_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("enrollments_user_course_unique").on(table.userId, table.courseId),
]);

export const progress = pgTable("progress", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	courseId: uuid("course_id").notNull(),
	plantId: uuid("plant_id").notNull(),
	progressPercent: integer("progress_percent").default(0).notNull(),
	currentSection: text("current_section"),
	lastActiveAt: timestamp("last_active_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("progress_plant_course_idx").using("btree", table.plantId.asc().nullsLast().op("uuid_ops"), table.courseId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "progress_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "progress_plant_id_plants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "progress_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("progress_user_course_unique").on(table.userId, table.courseId),
]);

export const questionEvents = pgTable("question_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	courseId: uuid("course_id").notNull(),
	plantId: uuid("plant_id").notNull(),
	sectionKey: text("section_key").notNull(),
	questionKey: text("question_key").notNull(),
	isCorrect: boolean("is_correct").notNull(),
	attemptIndex: integer("attempt_index").default(1).notNull(),
	responseMeta: jsonb("response_meta"),
	answeredAt: timestamp("answered_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("question_events_answered_at_idx").using("btree", table.answeredAt.asc().nullsLast().op("timestamp_ops")),
	index("question_events_plant_course_question_idx").using("btree", table.plantId.asc().nullsLast().op("uuid_ops"), table.courseId.asc().nullsLast().op("text_ops"), table.questionKey.asc().nullsLast().op("uuid_ops")),
	index("question_events_user_question_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.questionKey.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "question_events_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "question_events_plant_id_plants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "question_events_user_id_profiles_id_fk"
		}).onDelete("cascade"),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	plantId: uuid("plant_id").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	jobTitle: text("job_title"),
	status: userStatus().default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("profiles_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("profiles_plant_id_idx").using("btree", table.plantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "profiles_plant_id_plants_id_fk"
		}),
]);

export const adminRoles = pgTable("admin_roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	role: adminRole().notNull(),
	plantId: uuid("plant_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("admin_roles_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.id],
			name: "admin_roles_plant_id_plants_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "admin_roles_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	unique("admin_roles_user_role_plant_unique").on(table.userId, table.role, table.plantId),
]);

export const plants = pgTable("plants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("plants_name_unique").on(table.name),
]);

export const courses = pgTable("courses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	version: text().default('1.0').notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("courses_slug_unique").on(table.slug),
]);
