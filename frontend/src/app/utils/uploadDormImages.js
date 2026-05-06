import { supabase } from "../../lib/supabase";

const BUCKET_NAME = "dorm-listing-images";

function isUploadedDormUrl(image) {
  return typeof image === "string" && image.startsWith("http");
}

function getDormImagePathFromUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

  if (!url || !url.includes(marker)) return null;

  return url.split(marker)[1];
}

async function uploadOneDormImage(image, userId, folderId, index) {
  if (isUploadedDormUrl(image)) {
    return image;
  }

  const response = await fetch(image);
  const blob = await response.blob();

  const fileExt = blob.type.split("/")[1] || "jpg";

const filePath = `providers/${userId}/listings/${folderId}/image-${index}.${fileExt}`;
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadDormImages(images, userId, folderId) {
  return Promise.all(
    images.map((image, index) =>
      uploadOneDormImage(image, userId, folderId, index),
    ),
  );
}

export async function deleteRemovedDormImages(oldImages, newImages) {
  const removedImages = oldImages.filter(
    (oldImage) => isUploadedDormUrl(oldImage) && !newImages.includes(oldImage),
  );

  const paths = removedImages.map(getDormImagePathFromUrl).filter(Boolean);

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) throw error;
}
