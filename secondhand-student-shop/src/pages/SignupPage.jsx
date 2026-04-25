import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import "../styles/signup.css";

const initialForm = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

function validateSignupForm(formData) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;

  if (!usernamePattern.test(formData.username.trim())) {
    errors.username =
      "Username must be at least 3 characters and use only letters, numbers, or underscores.";
  }

  if (formData.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters long.";
  }

  if (!emailPattern.test(formData.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!formData.acceptedTerms) {
    errors.acceptedTerms = "You must accept the terms to continue.";
  }

  return errors;
}

export function SignupPage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });

    if (submitMessage) {
      setSubmitMessage("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateSignupForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("");
      return;
    }

    setSubmitMessage("Form looks good. Signup submission can be connected next.");
  }

  return (
    <main className="signup-page">
      <section className="signup-shell" aria-labelledby="signup-form-heading">
        <div className="signup-form-heading">
          <p className="eyebrow">Join the marketplace</p>
          <h1 id="signup-form-heading">Create your account</h1>
        </div>

        <form className="signup-form" noValidate onSubmit={handleSubmit}>
          <div className="signup-form-grid">
            <label className="signup-field">
              <span>Username</span>
              <input
                aria-invalid={Boolean(errors.username)}
                name="username"
                onChange={handleChange}
                placeholder="Enter your username"
                type="text"
                value={formData.username}
              />
              {errors.username ? <small className="signup-error">{errors.username}</small> : null}
            </label>

            <label className="signup-field">
              <span>Full name</span>
              <input
                aria-invalid={Boolean(errors.fullName)}
                name="fullName"
                onChange={handleChange}
                placeholder="Enter your full name"
                type="text"
                value={formData.fullName}
              />
              {errors.fullName ? <small className="signup-error">{errors.fullName}</small> : null}
            </label>

            <label className="signup-field">
              <span>University email</span>
              <input
                aria-invalid={Boolean(errors.email)}
                name="email"
                onChange={handleChange}
                placeholder="Enter your university email"
                type="email"
                value={formData.email}
              />
              {errors.email ? <small className="signup-error">{errors.email}</small> : null}
            </label>

            <label className="signup-field">
              <span>Password</span>
              <input
                aria-invalid={Boolean(errors.password)}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                value={formData.password}
              />
              {errors.password ? <small className="signup-error">{errors.password}</small> : null}
            </label>

            <label className="signup-field">
              <span>Confirm password</span>
              <input
                aria-invalid={Boolean(errors.confirmPassword)}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm your password"
                type="password"
                value={formData.confirmPassword}
              />
              {errors.confirmPassword ? (
                <small className="signup-error">{errors.confirmPassword}</small>
              ) : null}
            </label>
          </div>

          <label className="signup-check">
            <input
              checked={formData.acceptedTerms}
              name="acceptedTerms"
              onChange={handleChange}
              type="checkbox"
            />
            <span>I agree to the student marketplace terms and community guidelines.</span>
          </label>
          {errors.acceptedTerms ? (
            <small className="signup-error">{errors.acceptedTerms}</small>
          ) : null}

          <button className="button-link button-link-primary signup-submit" type="submit">
            Create account
          </button>

          {submitMessage ? <p className="signup-success">{submitMessage}</p> : null}
        </form>

        <p className="signup-login-hint">
          Already have an account?{" "}
          <Link className="signup-inline-link" to={ROUTES.login}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
