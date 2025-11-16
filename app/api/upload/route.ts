import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user'
import {
  uploadFileToS3,
  validateFileType,
  validateFileSize,
  MAX_FILE_SIZE,
} from '@/lib/s3'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!validateFileType(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.',
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.clerkUserId}-${Date.now()}.${fileExtension}`

    // Upload to S3
    const fileUrl = await uploadFileToS3(buffer, fileName, file.type)

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Handle GET request to check upload status/configuration
export async function GET() {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  })
}


