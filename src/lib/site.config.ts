export const site = {
  // Canonical public website; Convex deployment URLs remain separate.
  name: "Karturah",
  wordmark: "KARTURAH",
  url: "https://karturah.co",
  tagline: "A fragrance and leather house in Baltimore.",

  address: {
    line1: "",
    line2: "Baltimore, Maryland",
    hours: "Tuesday to Saturday, 11am to 7pm",
  },

  // Digits only, country code first. Used to build the wa.me link.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "14105550142",
  whatsappGreeting: "Hi Karturah, I have a question about",

  email: "simisolashitta@yahoo.com",
  instagram: "https://instagram.com/karturahofficial",

  // Build credit in the footer
  builtBy: {
    label: "Lamar",
    url: "https://simon-portfolio-yd81.vercel.app",
  },

  payments: "Enquiries and orders through WhatsApp for now.",
  shippingNote: "Made to order — lead time confirmed when you enquire.",
} as const;

export function whatsappLink(topic?: string): string {
  const text = topic ? `${site.whatsappGreeting} ${topic}.` : `${site.whatsappGreeting}...`;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
