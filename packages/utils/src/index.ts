const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatINR = (amount: number): string => inr.format(amount);

export const slugify = (input: string): string =>
  input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const durationLabel = (days: number): string =>
  `${days} ${days === 1 ? "Day" : "Days"} / ${Math.max(days - 1, 0)} ${days - 1 === 1 ? "Night" : "Nights"}`;
