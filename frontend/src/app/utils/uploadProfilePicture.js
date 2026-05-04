import { supabase } from "../../lib/supabase";

export async function uploadProfilePicture(file, userId) {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
const filePath = `profiles/${userId}/profile.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });
    

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);


  return publicUrlData.publicUrl;
}
export async function deleteProfilePictureFromUrl(imageUrl) {

  if (!imageUrl) return;

  const marker = "/storage/v1/object/public/profile-pictures/";

  if (!imageUrl.includes(marker)) {
    console.log("Not a Supabase profile picture URL");
    return;
  }

  const filePath = imageUrl.split(marker)[1];


  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .remove([filePath]);


  if (error) {
    throw error;
  }
}