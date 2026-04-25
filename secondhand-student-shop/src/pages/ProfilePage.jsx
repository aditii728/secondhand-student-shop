import "../styles/profile.css";
import { useAuth } from "../hooks/useAuth";

function getInitials(user) {
  const fullName = user.full_name?.trim();
  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  return user.username.slice(0, 2).toUpperCase();
}

export function ProfilePage() {
  const { currentUser, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <main className="profile-page"><section className="profile-card"><p>Loading your profile...</p></section></main>;
  }

  if (!currentUser) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p className="eyebrow">Profile</p>
          <h2>You are not logged in.</h2>
          <p>Log in to view your saved profile details and account information.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">{getInitials(currentUser)}</div>
          <div>
            <p className="eyebrow">Profile</p>
            <h2>{currentUser.full_name || currentUser.username}</h2>
            <p className="profile-subtitle">@{currentUser.username}</p>
          </div>
        </div>

        <div className="profile-grid">
          <article className="profile-field">
            <span>Email</span>
            <strong>{currentUser.email || "Not provided"}</strong>
          </article>
          <article className="profile-field">
            <span>University</span>
            <strong>{currentUser.university || "Not provided"}</strong>
          </article>
          <article className="profile-field">
            <span>Phone number</span>
            <strong>{currentUser.phone_number || "Not provided"}</strong>
          </article>
          <article className="profile-field">
            <span>Display name</span>
            <strong>{currentUser.full_name || currentUser.username}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}
