import { useEffect, useState } from "react";
import { fetchListings } from "../api/listings";

export function useListings() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadListings() {
      try {
        setIsLoading(true);
        setError("");

        const items = await fetchListings({ signal: controller.signal });
        setListings(items);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setError(loadError.message || "Failed to load listings.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadListings();

    return () => controller.abort();
  }, []);

  return { listings, isLoading, error };
}
