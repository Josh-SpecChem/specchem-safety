import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { plants, profiles } from '@/lib/db/schema';
import { plantSchema } from '@/lib/schemas';

/**
 * Test API endpoint to verify Drizzle ORM and Zod validation are working
 * GET: Returns all plants from database
 */

export async function GET() {
  try {
    console.log('Testing Drizzle connection...');
    
    // Test Drizzle query
    const plantsData = await db.select().from(plants).limit(5);
    console.log('Plants query result:', plantsData);
    
    // Test Zod validation
    const validatedPlants = plantsData.map(plant => {
      try {
        return plantSchema.parse({
          id: plant.id,
          name: plant.name,
          location: 'Test Location', // We'll need to add location field to schema
          isActive: plant.isActive,
          createdAt: plant.createdAt.toISOString(),
          updatedAt: plant.updatedAt.toISOString(),
        });
      } catch (zodError) {
        console.warn('Zod validation failed for plant:', plant, zodError);
        return null;
      }
    }).filter(Boolean);

    console.log('Validated plants:', validatedPlants);

    // Test a join query
    const profilesWithPlants = await db
      .select({
        profileId: profiles.id,
        email: profiles.email,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        plantName: plants.name,
      })
      .from(profiles)
      .innerJoin(plants, eq(profiles.plantId, plants.id))
      .limit(3);

    console.log('Profiles with plants:', profilesWithPlants);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Drizzle ORM and Zod validation are working correctly!',
        plantsCount: plantsData.length,
        validatedPlantsCount: validatedPlants.length,
        plants: validatedPlants,
        sampleProfilesWithPlants: profilesWithPlants,
        drizzleStatus: 'Connected',
        zodStatus: 'Validating',
      },
    });

  } catch (error) {
    console.error('Test API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      drizzleStatus: 'Error',
      zodStatus: 'Error',
    }, { status: 500 });
  }
}