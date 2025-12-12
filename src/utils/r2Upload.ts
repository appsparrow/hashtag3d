import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// R2 is S3-compatible, so we use the AWS SDK
const getR2Client = () => {
  const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
  const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured. Please check your environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export interface UploadResult {
  url: string;
  fileName: string;
}

/**
 * Upload a file to Cloudflare R2
 * @param file - The file to upload
 * @param folder - Optional folder path (e.g., "products", "thumbnails")
 * @returns Promise with the public URL and file name
 */
export async function uploadToR2(
  file: File,
  folder: string = "products"
): Promise<UploadResult> {
  const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
  const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;

  if (!bucketName) {
    throw new Error("VITE_R2_BUCKET_NAME is not configured");
  }

  if (!publicUrl) {
    throw new Error("VITE_R2_PUBLIC_URL is not configured");
  }

  // Generate unique file name
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11);
  const fileName = `${folder}/${timestamp}-${randomStr}.${fileExt}`;

  // Get file as array buffer (browser-compatible)
  const arrayBuffer = await file.arrayBuffer();
  
  // Convert to Uint8Array for browser compatibility
  const uint8Array = new Uint8Array(arrayBuffer);

  // Upload to R2
  // Note: R2 doesn't use ACLs. Public access is configured at the bucket level.
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: uint8Array,
    ContentType: file.type || `image/${fileExt}`,
  });

  try {
    await client.send(command);

    // Construct public URL
    // If using custom domain: https://cdn.hashtag3d.com/products/file.jpg
    // If using R2.dev: https://pub-xxxxx.r2.dev/products/file.jpg
    const url = `${publicUrl.replace(/\/$/, "")}/${fileName}`;

    return {
      url,
      fileName,
    };
  } catch (error: any) {
    console.error("R2 upload error:", error);
    throw new Error(`Failed to upload to R2: ${error.message || "Unknown error"}`);
  }
}

/**
 * Upload multiple files to R2
 * @param files - Array of files to upload
 * @param folder - Optional folder path
 * @returns Promise with array of upload results
 */
export async function uploadMultipleToR2(
  files: File[],
  folder: string = "products"
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    try {
      const result = await uploadToR2(file, folder);
      results.push(result);
    } catch (error: any) {
      console.error(`Failed to upload ${file.name}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}

