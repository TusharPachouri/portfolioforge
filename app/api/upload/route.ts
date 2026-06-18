import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { getCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { userImages } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import type { UploadApiResponse } from "cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const KINDS = ["avatar", "project", "gallery"] as const;
type Kind = (typeof KINDS)[number];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Throttle uploads per user (no-ops in dev without Redis)
  const rl = await rateLimit({ key: `upload:${session.user.id}`, limit: 30, windowSeconds: 600 });
  if (!rl.allowed) {
    return Response.json({ error: "Too many uploads. Please wait a few minutes." }, { status: 429 });
  }

  const cloud = getCloudinary();
  if (!cloud) {
    return Response.json({ error: "Storage not configured." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  const kindRaw = String(form.get("kind") ?? "other");
  const kind: Kind | "other" = (KINDS as readonly string[]).includes(kindRaw) ? (kindRaw as Kind) : "other";

  if (!(file instanceof Blob)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Only JPG, PNG, WebP and AVIF are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let result: UploadApiResponse;
  try {
    result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloud.uploader.upload_stream(
        {
          folder: `portfolioforge/${session.user.id}/${kind}`,
          resource_type: "image",
          unique_filename: true,
          overwrite: false,
          // Cap size, auto-optimize quality, strip metadata
          transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error ?? new Error("Upload failed"));
          else resolve(uploaded);
        },
      );
      stream.end(buffer);
    });
  } catch {
    return Response.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }

  // Record in the image ledger
  try {
    await db.insert(userImages).values({
      userId: session.user.id,
      url: result.secure_url,
      publicId: result.public_id,
      kind,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    });
  } catch {
    // Non-fatal: the image is already in Cloudinary; the URL is still usable.
  }

  return Response.json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  });
}
