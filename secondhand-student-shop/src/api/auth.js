const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export async function signupUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Signup failed (${response.status})`);
    error.fieldErrors = data.errors || {};
    throw error;
  }

  return data;
}
