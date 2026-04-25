import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import "../styles/login.css";

const initialForm = {
  identifier: "",
  password: "",
  rememberMe: false,
};

function validateLoginForm(formData) {
  const errors = {};

  if (formData.identifier.trim().length < 3) {
    errors.identifier = "Enter your username or email address.";
  }

  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
}

export function LoginPage() {
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

    const nextErrors = validateLoginForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("");
      return;
    }

    setSubmitMessage("Credentials look valid. Authentication can be connected next.");
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-form-heading">
        <section className="login-form-card">
          <div className="login-form-heading">
            <p className="eyebrow">Account login</p>
            <h2 id="login-form-heading">Log in</h2>
          </div>

          <form className="login-form" noValidate onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Username or email</span>
              <input
                aria-invalid={Boolean(errors.identifier)}
                name="identifier"
                onChange={handleChange}
                placeholder="Enter your username or email"
                type="text"
                value={formData.identifier}
              />
              {errors.identifier ? (
                <small className="login-error">{errors.identifier}</small>
              ) : null}
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                aria-invalid={Boolean(errors.password)}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                value={formData.password}
              />
              {errors.password ? <small className="login-error">{errors.password}</small> : null}
            </label>

            <div className="login-row">
              <label className="login-check">
                <input
                  checked={formData.rememberMe}
                  name="rememberMe"
                  onChange={handleChange}
                  type="checkbox"
                />
                <span>Remember me</span>
              </label>

              <button className="login-text-button" type="button">
                Forgot password?
              </button>
            </div>

            <button className="button-link button-link-primary login-submit" type="submit">
              Log in
            </button>

            {submitMessage ? <p className="login-success">{submitMessage}</p> : null}
          </form>

          <p className="login-signup-hint">
            Don&apos;t have an account?{" "}
            <Link className="login-inline-link" to={ROUTES.signup}>
              Create one
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
