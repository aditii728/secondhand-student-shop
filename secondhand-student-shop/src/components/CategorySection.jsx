import { SectionHeading } from "./SectionHeading";

function CategoryCard({ category }) {
  return (
    <article className="info-card">
      <span className="pill">{category.tag}</span>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </article>
  );
}

export function CategorySection({ categories }) {
  return (
    <section className="section" id="categories">
      <SectionHeading
        eyebrow="Categories"
        title="Shop by category."
        description="Browse the essentials students buy and sell most often."
      />

      <div className="info-grid">
        {categories.map((category) => (
          <CategoryCard category={category} key={category.name} />
        ))}
      </div>
    </section>
  );
}
