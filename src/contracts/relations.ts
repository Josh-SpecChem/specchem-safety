/**
 * Drizzle Relations - Database Relationship Definitions
 * 
 * Defines all foreign key relationships and enables relational queries.
 * Must stay synchronized with schema.app.ts
 */

import { relations } from "drizzle-orm/relations";
import { 
  courses, 
  activityEvents, 
  plants, 
  profiles, 
  enrollments, 
  progress, 
  questionEvents, 
  adminRoles 
} from "./schema.app";

// ========================================
// CORE ENTITY RELATIONS
// ========================================

export const plantsRelations = relations(plants, ({many}) => ({
	// Users belong to plants (tenant isolation)
	profiles: many(profiles),
	
	// Plant-scoped data
	enrollments: many(enrollments),
	progresses: many(progress),
	activityEvents: many(activityEvents),
	questionEvents: many(questionEvents),
	adminRoles: many(adminRoles),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	// Course enrollments across all plants
	enrollments: many(enrollments),
	progresses: many(progress),
	
	// Course activity tracking
	activityEvents: many(activityEvents),
	questionEvents: many(questionEvents),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	// Each profile belongs to one plant (tenant isolation)
	plant: one(plants, {
		fields: [profiles.plantId],
		references: [plants.id]
	}),
	
	// User's training data
	enrollments: many(enrollments),
	progresses: many(progress),
	
	// User's activity tracking
	activityEvents: many(activityEvents),
	questionEvents: many(questionEvents),
	
	// User's admin roles
	adminRoles: many(adminRoles),
}));

// ========================================
// TRAINING MANAGEMENT RELATIONS
// ========================================

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	// Enrollment belongs to user, course, and plant
	profile: one(profiles, {
		fields: [enrollments.userId],
		references: [profiles.id]
	}),
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [enrollments.plantId],
		references: [plants.id]
	}),
}));

export const progressRelations = relations(progress, ({one}) => ({
	// Progress belongs to user, course, and plant
	profile: one(profiles, {
		fields: [progress.userId],
		references: [profiles.id]
	}),
	course: one(courses, {
		fields: [progress.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [progress.plantId],
		references: [plants.id]
	}),
}));

// ========================================
// ADMIN & RBAC RELATIONS
// ========================================

export const adminRolesRelations = relations(adminRoles, ({one}) => ({
	// Admin role belongs to user and optionally scoped to plant
	profile: one(profiles, {
		fields: [adminRoles.userId],
		references: [profiles.id]
	}),
	plant: one(plants, {
		fields: [adminRoles.plantId],
		references: [plants.id]
	}),
}));

// ========================================
// ANALYTICS & TRACKING RELATIONS
// ========================================

export const activityEventsRelations = relations(activityEvents, ({one}) => ({
	// Activity event belongs to user, course, and plant
	profile: one(profiles, {
		fields: [activityEvents.userId],
		references: [profiles.id]
	}),
	course: one(courses, {
		fields: [activityEvents.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [activityEvents.plantId],
		references: [plants.id]
	}),
}));

export const questionEventsRelations = relations(questionEvents, ({one}) => ({
	// Question event belongs to user, course, and plant
	profile: one(profiles, {
		fields: [questionEvents.userId],
		references: [profiles.id]
	}),
	course: one(courses, {
		fields: [questionEvents.courseId],
		references: [courses.id]
	}),
	plant: one(plants, {
		fields: [questionEvents.plantId],
		references: [plants.id]
	}),
}));

// Relations are already exported individually above
