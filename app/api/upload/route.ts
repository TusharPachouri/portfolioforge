import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentType, size } = await req.json();

  if (!ALLOWED_TYPES.includes(contentType)) {
    return Response.json({ error: "Only JPG, PNG and WebP are allowed." }, { status: 400 });
  }
  if (size > MAX_SIZE) {
    return Response.json({ error: "File must be under 2MB." }, { status: 400 });
  }

  const r2 = process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
    ? new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

  if (!r2 || !process.env.R2_BUCKET_NAME) {
    return Response.json({ error: "Storage not configured." }, { status: 503 });
  }

  const ext = contentType.split("/")[1];
  const key = `pf-avatars/${session.user.id}/${Date.now()}.${ext}`;

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 120 }
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return Response.json({ uploadUrl: signedUrl, publicUrl });
}
