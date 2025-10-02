import { adminRoles, courses, enrollments, plants, profiles, progress } from '@/contracts';
import { eq } from 'drizzle-orm';
import { getDb } from './connection';

/**
 * Database seeding utilities for SpecChem Safety Training
 * Phase 3: Initial data setup for ebook/ and ebook-spanish/ courses
 */

// Default plants data
const defaultPlants = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Columbus, OH - Corporate', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Atlanta, GA', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Denver, CO', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Seattle, WA', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Phoenix, AZ', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Dallas, TX', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Chicago, IL', isActive: true },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Miami, FL', isActive: true },
];

// Primary courses (ebook/ and ebook-spanish/)
const primaryCourses = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    slug: 'function-specific-hazmat-training',
    title: 'Function-Specific HazMat Training',
    version: '1.0',
    isPublished: true,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    slug: 'function-specific-hazmat-training-spanish',
    title: 'Capacitación Específica de HazMat por Función',
    version: '1.0',
    isPublished: true,
  },
];

/**
 * Seed the database with initial plants
 */
export async function seedPlants() {
  console.log('🌱 Seeding plants...');
  
  for (const plant of defaultPlants) {
    try {
      // Check if plant already exists
      const existing = await getDb().query.plants.findFirst({
        where: eq(plants.name, plant.name),
      });

      if (!existing) {
        await getDb().insert(plants).values({
          id: plant.id,
          name: plant.name,
          isActive: plant.isActive,
        });
        console.log(`   ✅ Created plant: ${plant.name}`);
      } else {
        console.log(`   ⏭️  Plant already exists: ${plant.name}`);
      }
    } catch (error) {
      console.error(`   ❌ Error creating plant ${plant.name}:`, error);
    }
  }
  
  console.log('✅ Plants seeding completed\n');
}

/**
 * Seed the database with primary courses
 */
export async function seedCourses() {
  console.log('📚 Seeding courses...');
  
  for (const course of primaryCourses) {
    try {
      // Check if course already exists
      const existing = await getDb().query.courses.findFirst({
        where: eq(courses.slug, course.slug),
      });

      if (!existing) {
        await getDb().insert(courses).values({
          id: course.id,
          slug: course.slug,
          title: course.title,
          version: course.version,
          isPublished: course.isPublished,
        });
        console.log(`   ✅ Created course: ${course.title}`);
      } else {
        // Update existing course to ensure it's published
        await getDb()
          .update(courses)
          .set({
            title: course.title,
            isPublished: course.isPublished,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(courses.id, existing.id));
        console.log(`   🔄 Updated course: ${course.title}`);
      }
    } catch (error) {
      console.error(`   ❌ Error creating course ${course.title}:`, error);
    }
  }
  
  console.log('✅ Courses seeding completed\n');
}

/**
 * Create a sample admin user (for testing)
 */
export async function createSampleAdmin(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  plantId?: string
) {
  console.log('👤 Creating sample admin user...');
  
  try {
    const defaultPlantId = plantId || defaultPlants[0]?.id; // Columbus, OH - Corporate
    if (!defaultPlantId) {
      throw new Error('No default plant available');
    }
    
    // Create profile
    const [profile] = await getDb().insert(profiles).values({
      id: userId,
      plantId: defaultPlantId,
      firstName,
      lastName,
      email,
      status: 'active',
    }).returning();

    console.log(`   ✅ Created profile: ${firstName} ${lastName}`);

    // Make them an HR admin
    await getDb().insert(adminRoles).values({
      userId: userId,
      role: 'hr_admin',
      plantId: null, // Organization-wide admin
    });

    console.log(`   ✅ Assigned HR admin role`);

    // Enroll in both courses
    for (const course of primaryCourses) {
      await getDb().insert(enrollments).values({
        userId: userId,
        courseId: course.id,
        plantId: defaultPlantId,
        status: 'enrolled',
      });

      await getDb().insert(progress).values({
        userId: userId,
        courseId: course.id,
        plantId: defaultPlantId,
        progressPercent: 0,
        currentSection: 'introduction',
      });
    }

    console.log(`   ✅ Enrolled in all courses`);
    console.log('✅ Sample admin user created\n');

    return profile;
  } catch (error) {
    console.error('   ❌ Error creating sample admin:', error);
    throw error;
  }
}

/**
 * Auto-enroll a user in primary courses
 */
export async function autoEnrollUser(userId: string, plantId: string) {
  console.log(`📝 Auto-enrolling user ${userId} in primary courses...`);
  
  try {
    for (const course of primaryCourses) {
      // Check if already enrolled
      const existingEnrollment = await getDb().query.enrollments.findFirst({
        where: (enrollments: any, { and, eq }: any) => and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, course.id)
        ),
      });

      if (!existingEnrollment) {
        // Create enrollment
        await getDb().insert(enrollments).values({
          userId,
          courseId: course.id,
          plantId,
          status: 'enrolled',
        });

        // Create initial progress
        await getDb().insert(progress).values({
          userId,
          courseId: course.id,
          plantId,
          progressPercent: 0,
          currentSection: 'introduction',
        });

        console.log(`   ✅ Enrolled in: ${course.title}`);
      } else {
        console.log(`   ⏭️  Already enrolled in: ${course.title}`);
      }
    }
    
    console.log('✅ Auto-enrollment completed\n');
  } catch (error) {
    console.error('   ❌ Error during auto-enrollment:', error);
    throw error;
  }
}

/**
 * Run complete database seeding
 */
export async function runDatabaseSeeding() {
  console.log('🚀 Starting database seeding process...\n');
  
  try {
    await seedPlants();
    await seedCourses();
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Return course IDs for reference
    return {
      plants: defaultPlants,
      courses: primaryCourses,
    };
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
}

/**
 * Get seeded data summary
 */
export async function getSeedingSummary() {
  const plantsCount = await getDb().select().from(plants);
  const coursesCount = await getDb().select().from(courses);
  const profilesCount = await getDb().select().from(profiles);
  
  return {
    plants: plantsCount.length,
    courses: coursesCount.length,
    profiles: profilesCount.length,
    primaryCourses: primaryCourses.map(c => ({
      slug: c.slug,
      title: c.title,
    })),
  };
}