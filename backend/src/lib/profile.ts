export function calculateProfileCompletion(profileData: any): number {
  const fields = [
    "gender",
    "dob",
    "height",
    "education",
    "occupation",
    "location",
    "familyDetails",
    "spiritualDetails",
    "diet",
    "about",
    "profileImage",
  ];

  let filled = 0;
  fields.forEach((field) => {
    if (profileData[field]) filled++;
  });

  // galleryImages is array
  if (profileData.galleryImages && profileData.galleryImages.length > 0) {
    filled++;
  }

  return Math.round((filled / (fields.length + 1)) * 100);
}
