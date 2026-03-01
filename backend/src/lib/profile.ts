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

  // galleryImages is array (optional for 100% but good to have)
  // Let's make gallery optional for "profileCompleted" status to be true
  // Or keep it strict. If strict:
  // if (profileData.galleryImages && profileData.galleryImages.length > 0) {
  //   filled++;
  // }
  
  // Total fields to check against
  const totalFields = fields.length; 

  return Math.round((filled / totalFields) * 100);
}
