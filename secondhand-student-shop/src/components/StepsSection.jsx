import { SectionHeading } from "./SectionHeading";

function StepCard({ index, step }) {
  return (
    <article className="step-card">
      <span className="step-number">0{index + 1}</span>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </article>
  );
}

export function StepsSection({ steps }) {
  return (
    <section className="section" id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="A simple process from listing to pickup."
      />

      <div className="steps-grid">
        {steps.map((step, index) => (
          <StepCard index={index} key={step.title} step={step} />
        ))}
      </div>
    </section>
  );
}
