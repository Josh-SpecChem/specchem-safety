import { relations } from "drizzle-orm/relations";
import { courses, activityEvents, plants, profiles, enrollments, progress, questionEvents, adminRoles } from "./schema";

export const activityEventsRelations = relations(activityEvents, ({one}) => ({
	course: one(courses, {
		fields: [activityEvents.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [activityEvents.plantId],
		references: [plants.id]
	}),
	profile: one(profiles, {
		fields: [activityEvents.userId],
		references: [profiles.id]
	}),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	activityEvents: many(activityEvents),
	enrollments: many(enrollments),
	progresses: many(progress),
	questionEvents: many(questionEvents),
}));

export const plantsRelations = relations(plants, ({many}) => ({
	activityEvents: many(activityEvents),
	enrollments: many(enrollments),
	progresses: many(progress),
	questionEvents: many(questionEvents),
	profiles: many(profiles),
	adminRoles: many(adminRoles),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	activityEvents: many(activityEvents),
	enrollments: many(enrollments),
	progresses: many(progress),
	questionEvents: many(questionEvents),
	plant: one(plants, {
		fields: [profiles.plantId],
		references: [plants.id]
	}),
	adminRoles: many(adminRoles),
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [enrollments.plantId],
		references: [plants.id]
	}),
	profile: one(profiles, {
		fields: [enrollments.userId],
		references: [profiles.id]
	}),
}));

export const progressRelations = relations(progress, ({one}) => ({
	course: one(courses, {
		fields: [progress.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [progress.plantId],
		references: [plants.id]
	}),
	profile: one(profiles, {
		fields: [progress.userId],
		references: [profiles.id]
	}),
}));

export const questionEventsRelations = relations(questionEvents, ({one}) => ({
	course: one(courses, {
		fields: [questionEvents.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [questionEvents.plantId],
		references: [plants.id]
	}),
	profile: one(profiles, {
		fields: [questionEvents.userId],
		references: [profiles.id]
	}),
}));

export const adminRolesRelations = relations(adminRoles, ({one}) => ({
	plant: one(plants, {
		fields: [adminRoles.plantId],
		references: [plants.id]
	}),
	profile: one(profiles, {
		fields: [adminRoles.userId],
		references: [profiles.id]
	}),
}));