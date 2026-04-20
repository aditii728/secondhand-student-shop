import { ROUTES } from "../routes/paths";
import { ButtonLink } from "./ButtonLink";

export function CtaBanner() {
  return (
    <section className="cta-banner">
      <div>
        <p className="eyebrow">Get Started</p>
        <h2>Browse listings and find what you need for student life.</h2>
      </div>
      <ButtonLink to={ROUTES.browse}>View listings</ButtonLink>
    </section>
  );
}
