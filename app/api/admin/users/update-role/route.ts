import { auth } from '@/app/(auth)/auth';
import { isAdminUserRole } from '@/lib/admin';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function POST(req: NextRequest) {
  // Check if user is authenticated and is an admin
  const session = await auth();

  if (!session || !isAdminUserRole(session.user.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, role } = await req.json();

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user role in database
    await db.update(user)
      .set({ role })
      .where(eq(user.id, userId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}