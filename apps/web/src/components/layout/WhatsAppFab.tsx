import { whatsappLink } from "@/lib/site";

/** Quiet floating WhatsApp entry: small pill, no pulsing. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-forest px-5 text-sm font-medium text-ivory shadow-lg shadow-black/10 transition-colors hover:bg-forest-deep"
    >
      <span aria-hidden>●</span> WhatsApp
    </a>
  );
}
