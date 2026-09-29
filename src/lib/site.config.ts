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
  whatsappGreeting: "Hi Kartura, I have a question about",

  email: "contact@kartura.com",
  instagram: "https://instagram.com/kartura",

  // Build credit in the footer
  builtBy: {
    label: "Lamar",
    url: "https://simon-portfolio-yd81.vercel.app",
  },

  payments: "Card and Apple Pay through Stripe.",
  shippingNote: "Free US shipping over $200. Made to order ships in about three weeks.",
} as const;

export function whatsappLink(topic?: string): string {
  const text = topic ? `${site.whatsappGreeting} ${topic}.` : `${site.whatsappGreeting}...`;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
