SpecChem Safety Training — Domain One-Pager

Domain (plain language)

A lightweight LMS for SpecChem associates to complete an ebook-based safety course. HR administers enrollments and reporting. Plant Managers view aggregate results for their plant. Associates authenticate individually, progress through the ebook, answer inline quiz questions, and must answer correctly to advance.

Actors & permissions
	•	Admin (generic role; permission-gated)
	•	HR Admin: org-wide read, manage enrollments, export.
	•	Dev Admin: system settings, feature flags (no special data powers by default).
	•	Plant Manager: read-only dashboards for their plant.
	•	Associate: authenticate, view course, progress, answer questions.

Tenancy
	•	Tenant = Plant (row-level multi-tenancy).
	•	Every tenant-scoped row carries plant_id; RLS enforces isolation.
	•	HR Admins can read across plants; Plant Managers restricted to their plant; Associates restricted to their own rows.

Core nouns (with key attributes & states)
	•	Plant
	•	id, name (preset list), is_active, timestamps.
	•	User (Associate)
	•	id (auth), plant_id, first_name, last_name, email, job_title?, timestamps.
	•	States: status ∈ {active, suspended}.
	•	Admin / PlantManager (Role assignment)
	•	user_id, role ∈ {admin, plant_manager}, plant_id? (null for org-wide admin).
	•	Course (initially one ebook; future-proof for many)
	•	id, slug, title, version, is_published, timestamps.
	•	Enrollment (per user × course)
	•	id, user_id, course_id, plant_id, enrolled_at, completion_at?
	•	State: status ∈ {enrolled, in_progress, completed} (derived from progress).
	•	Progress
	•	Minimal: progress_percent, last_active_at, current_section, timestamps.
	•	Question Event (append-only analytics; no full quiz authoring yet)
	•	id, user_id, course_id, plant_id, section_key, question_key, answered_at
	•	is_correct, attempt_index, response_meta jsonb? (optional payload)
	•	Activity Event (optional, for audits / time spent)
	•	id, user_id, course_id, plant_id, occurred_at, type ∈ {view_section, start_course, complete_course}, meta jsonb

Note: We deliberately do not model Questions/Choices/Quizzes as first-class tables yet. We store per-question analytics via question_key/section_key emitted from the front-end. This ships fast now and leaves a migration path to full quiz authoring later (we can backfill from events).

Happy paths
	•	Associate completes course
	1.	Sign in → auto-enrolled (or HR enrolls) → reads ebook sections
	2.	Answers inline questions; must be correct to advance (front-end gate)
	3.	Events recorded: QuestionEvent per attempt; Progress updated; on 100%, Enrollment.completed
	•	Plant Manager reporting
	•	Views completion rates, average attempts per question, “most missed questions,” for their plant.
	•	HR reporting
	•	Org-wide compliance view; CSV export.

Bounded contexts
	•	Identity/Auth: Supabase Auth, roles, RLS.
	•	Learning (LMS): Courses, Enrollments, Progress.
	•	Analytics: Question/Activity events, materialized views for dashboards.
	•	Admin: Role assignments, flags, exports.

RLS (summary)
	•	users/profiles: user can read self; Admin can read all; Plant Manager can read users in their plant_id.
	•	enrollments, progress, question_events, activity_events:
	•	Associate: user_id = auth.uid().
	•	Plant Manager: rows where plant_id = manager.plant_id.
	•	Admin: unrestricted (or restricted-by-role if desired).
	•	All tenant tables include plant_id and are indexed on (plant_id, …).

Minimal data we’ll capture (to be “business-correct”)
	•	Enrollment timing: enrolled_at, completion_at.
	•	Progress: progress_percent, current_section, last_active_at.
	•	Per-question analytics: question_key, section_key, is_correct, attempt_index, answered_at.
	•	Timestamps everywhere: created_at, updated_at.

Indexes (first pass)
	•	enrollments (plant_id, course_id, status)
	•	progress (user_id, course_id) and (plant_id, course_id)
	•	question_events (plant_id, course_id, question_key, answered_at desc)
	•	FKs on all relations; unique enrollment (user_id, course_id) (soft-delete aware if needed)

State rules (to prevent impossible states)
	•	completed ⇒ completion_at IS NOT NULL and progress_percent = 100.
	•	progress_percent is monotonic non-decreasing per (user_id, course_id).
	•	A question_event.is_correct = true can optionally update progress; front-end still enforces gating.

Reporting slices (MVP)
	•	Plant completion: % completed, median days to complete, last activity.
	•	Question difficulty: highest miss rate by question_key and by section_key.
	•	User detail: timeline of activity & attempts.

Ship-now vs. grow-later
	•	Ship-now: Events-only quiz tracking (no backend questions table), single course, simple dashboards, strict RLS by plant.
	•	Grow-later: Introduce questions, question_options, quizzes, and migrate by resolving question_key → question.id. Add multi-course programs, retakes, and richer audits.

⸻

“Contracts” (where this lives in code)
	•	Drizzle schema: src/contracts/schema.ts — tables, enums, FKs, comments.
	•	Zod: src/contracts/zod/*.ts — EnrollmentInput, ProgressPatch, QuestionEventInput (validate question_key, is_correct, etc.).
	•	Helpers: markProgress(userId, courseId, sectionKey), recordQuestionEvent(input), completeEnrollment(userId, courseId).

⸻

Quick self-check (money/impact path)
	1.	Tables? Enrollment/Progress/QuestionEvent capture completion & difficulty.
	2.	3 queries in <5 min?
	•	Plant completion rate
	•	Most-missed questions this month
	•	User activity timeline
	3.	RLS? Plant-scoped read for managers; user-scoped for associates; admin wide.
	4.	Soft-delete? Not needed for events; consider deleted_at on enrollments if you ever “revoke.”
	5.	Indexes? Listed above to keep dashboards snappy.

⸻

Next steps (practical)
	1.	Lock plant list and seed table.
	2.	Implement Supabase RLS policies as above.
	3.	Add event emitters on the front-end for QuestionEvent + progress updates.
	4.	Build two dashboards: Plant Manager (scoped), HR (org-wide).
	5.	Write ADRs:
	•	0001-tenancy-plant-as-tenant.md
	•	0002-quiz-events-mvp.md (no backend authoring yet)