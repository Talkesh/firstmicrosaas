import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

// Allowed file types for image uploads
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

// Maximum file size (5MB in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Upload file to S3
 * Returns the file URL (public URL or presigned URL based on bucket configuration)
 */
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)

  // Check if bucket is configured to use presigned URLs
  const usePresignedUrls = process.env.AWS_S3_USE_PRESIGNED_URLS === 'true'
  
  if (usePresignedUrls) {
    // Generate presigned URL for private buckets
    return await getPresignedUrl(key)
  } else {
    // Return public URL for public buckets
    const region = process.env.AWS_REGION || 'us-east-1'
    // Handle different S3 URL formats
    if (S3_BUCKET_NAME.includes('.')) {
      // Virtual-hosted-style URL
      return `https://${S3_BUCKET_NAME}/${key}`
    } else {
      // Path-style URL
      return `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
    }
  }
}

/**
 * Generate presigned URL for file access (if bucket is private)
 */
export async function getPresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  return url
}

/**
 * Validate file type
 */
export function validateFileType(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.includes(mimeType)
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

