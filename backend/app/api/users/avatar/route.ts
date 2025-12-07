import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

// POST /api/users/avatar - Upload profile picture
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate image dimensions using sharp metadata
    const metadata = await sharp(buffer).metadata();
    if ((metadata.width || 0) > 4000 || (metadata.height || 0) > 4000) {
      return NextResponse.json(
        { error: 'Image dimensions must not exceed 4000x4000 pixels' },
        { status: 400 }
      );
    }

    // Process image with sharp (resize and optimize)
    const processedImage = await sharp(buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${user.id}-${timestamp}.jpg`;
    const filepath = join(uploadsDir, filename);

    // Delete old avatar file if it exists
    if (user.avatar) {
      const oldFilePath = join(process.cwd(), 'public', user.avatar);
      try {
        await unlink(oldFilePath);
      } catch (error) {
        // Log but don't fail - file might already be deleted
        console.warn('Failed to delete old avatar file:', error);
      }
    }

    try {
      // Save file
      await writeFile(filepath, processedImage);

      // Update user avatar in database
      const avatarUrl = `/uploads/avatars/${filename}`;
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      });

      return NextResponse.json({
        message: 'Avatar uploaded successfully',
        avatar: avatarUrl,
        user: updatedUser,
      });
    } catch (dbError) {
      // If database update fails, delete the file we just saved
      try {
        await unlink(filepath);
      } catch (deleteError) {
        console.error('Failed to cleanup uploaded file after DB error:', deleteError);
      }
      console.error('Failed to update avatar in database:', dbError);
      return NextResponse.json(
        { error: 'Failed to save avatar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/avatar - Remove profile picture
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete avatar file if it exists
    if (user.avatar) {
      const filePath = join(process.cwd(), 'public', user.avatar);
      try {
        await unlink(filePath);
      } catch (error) {
        // Log but don't fail - file might already be deleted
        console.warn('Failed to delete avatar file:', error);
      }
    }

    // Update user to remove avatar
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    return NextResponse.json({
      message: 'Avatar removed successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Failed to remove avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
