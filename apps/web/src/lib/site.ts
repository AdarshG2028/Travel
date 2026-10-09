export const site = {
  name: "Guru Raghavendra Tours and Travels",
  tagline: "Travel from Bengaluru, rooted in South India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919800000000",
};

export const whatsappLink = (text = "Hi, I would like to plan a trip.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
