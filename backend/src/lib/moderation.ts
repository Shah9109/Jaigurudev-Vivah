// Simple regex-based filter
// In production, this should be replaced by a more sophisticated NLP service

const inappropriatePatterns = [
  // Flirting / Romantic Slang
  /\b(dating|gf|bf|girlfriend|boyfriend|lover|sexy|hot|babe|darling|honey)\b/i,
  /\b(kiss|hug|romance|meet up|hang out|hookup)\b/i,
  
  // Contact Sharing (Phone, Email, Social)
  /\b(\d{10}|\d{3}[-\s]\d{3}[-\s]\d{4})\b/, // Phone
  /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, // Email
  /\b(instagram|insta|fb|facebook|whatsapp|snapchat|snap|telegram|tg)\b/i,
  
  // Suspicious
  /\b(money|transfer|bank|pay|cash)\b/i
];

export function detectInappropriateContent(text: string): { detected: boolean; reason?: string } {
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(text)) {
      return { detected: true, reason: "Inappropriate content detected" };
    }
  }
  return { detected: false };
}
