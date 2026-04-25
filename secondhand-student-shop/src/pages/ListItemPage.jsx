import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchCategories } from "../api/listings";
import { ListingComposer } from "../components/browse/ListingComposer";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes/paths";
import "../styles/browse.css";

export function ListItemPage() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        setError("");
        const items = await fetchCategories({ signal: controller.signal });
        setCategories(items);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }
        setError(loadError.message || "Failed to load categories.");
      }
    }

    if (isAuthenticated) {
      loadCategories();
    }

    return () => controller.abort();
  }, [isAuthenticated]);

  if (isAuthReady && !isAuthenticated) {
    return <Navigate replace to={ROUTES.login} />;
  }

  return (
    <main className="browse-page">
      <section className="section">
        <ListingComposer
          categories={categories}
          onCreated={() => {
            navigate(ROUTES.myItems);
          }}
        />
        {error ? <p className="browse-helper-text">{error}</p> : null}
      </section>
    </main>
  );
}
