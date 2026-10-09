import type { ReviewDTO } from "@travel/types";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";

export function Reviews({ reviews }: { reviews: ReviewDTO[] }) {
  if (!reviews.length) return null;
  return (
    <section className="bg-ivory py-28 md:py-36">
      <Container>
        <Eyebrow className="text-forest">From our travellers</Eyebrow>
        <div className="mt-12 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {reviews.slice(0, 4).map((r, i) => (
            <figure key={r.id} className={i % 2 ? "md:mt-20" : ""}>
              <p aria-label={`${r.rating} out of 5 stars`} className="text-accent">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              <blockquote className="mt-4 font-display text-2xl leading-snug md:text-3xl">“{r.body}”</blockquote>
              <figcaption className="mt-5 text-sm text-ink-soft">{r.authorName}, {r.authorCity}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
