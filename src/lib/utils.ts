const CRICKET_IMAGES = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop", // Stadium night
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop", // Cricket pitch/bat
  "https://images.unsplash.com/photo-1624526267942-ab0f0b4de496?q=80&w=800&auto=format&fit=crop", // Ball on pitch
  "https://images.unsplash.com/photo-1593786480373-1087082f8d4f?q=80&w=800&auto=format&fit=crop", // Player action
  "https://images.unsplash.com/photo-1589801358942-0f04ec6c0bce?q=80&w=800&auto=format&fit=crop", // Grass field
  "https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?q=80&w=800&auto=format&fit=crop"  // Helmet/Gear
];

export function getTournamentThumbnail(id: string): string {
  // Simple hash function to always pick the same image for a specific ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CRICKET_IMAGES.length;
  return CRICKET_IMAGES[index];
}
