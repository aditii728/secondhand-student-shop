import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { deleteListing } from "../api/listings";
import { BrowseListingGrid } from "../components/browse/BrowseListingGrid";
import { SectionHeading } from "../components/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import { useListings } from "../hooks/useListings";
import { ROUTES } from "../routes/paths";
import "../styles/browse.css";

export function MyItemsPage() {
  const { accessToken, currentUser, isAuthenticated, isAuthReady, refreshSession } = useAuth();
  const { listings, isLoading, error, removeListing } = useListings();
  const [deletingId, setDeletingId] = useState("");

  if (isAuthReady && !isAuthenticated) {
    return <Navigate replace to={ROUTES.login} />;
  }

  const myListings = listings.filter((listing) => listing.sellerId === String(currentUser?.id || ""));

  async function handleDeleteListing(listing) {
    setDeletingId(listing.id);
    try {
      let token = accessToken;
      if (!token) {
        token = await refreshSession();
      }

      await deleteListing({ accessToken: token, listingId: listing.id });
      removeListing(listing.id);
    } catch (deleteError) {
      window.alert(deleteError.message || "Could not remove listing.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="browse-page">
      <section className="section">
        <SectionHeading
          eyebrow="My items"
          title="Manage your listings."
          description="Review the items you have posted and remove anything that is no longer available."
        />

        {!isLoading && !error && myListings.length === 0 ? (
          <section className="browse-auth-prompt">
            <p className="eyebrow">No listings yet</p>
            <h2>You have not posted anything yet.</h2>
            <p>When you are ready to sell something, create your first item listing.</p>
            <Link className="button-link button-link-primary" to={ROUTES.listItem}>
              List an item
            </Link>
          </section>
        ) : (
          <BrowseListingGrid
            canDeleteListing={() => true}
            deletingId={deletingId}
            error={error}
            isLoading={isLoading}
            listings={myListings}
            onDeleteListing={handleDeleteListing}
          />
        )}
      </section>
    </main>
  );
}
