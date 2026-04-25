import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import { ROUTES } from "../routes/paths";
import "../styles/signup.css";

const initialForm = {
  username: "",
  fullName: "",
  email: "",
  university: "",
  phoneNumber: "",
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

  if (formData.university.trim().length < 2) {
    errors.university = "Enter your university name.";
  }

  const normalizedPhoneNumber = formData.phoneNumber.replace(/[^\d+]/g, "");
  if (normalizedPhoneNumber.replace("+", "").length < 7) {
    errors.phoneNumber = "Enter a valid phone number.";
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (submitError) {
      setSubmitError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateSignupForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("");
      setSubmitError("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const response = await signupUser({
        username: formData.username.trim(),
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        university: formData.university.trim(),
        phone_number: formData.phoneNumber.trim(),
        password: formData.password,
      });

      setSubmitMessage(response.message || "Account created successfully.");
      setFormData(initialForm);
      setErrors({});

      window.setTimeout(() => {
        navigate(ROUTES.login);
      }, 900);
    } catch (error) {
      setSubmitError(error.message || "Signup failed.");

      const mappedErrors = {};
      const fieldErrors = error.fieldErrors || {};

      if (fieldErrors.full_name) {
        mappedErrors.fullName = fieldErrors.full_name;
      }
      if (fieldErrors.phone_number) {
        mappedErrors.phoneNumber = fieldErrors.phone_number;
      }

      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (key === "full_name" || key === "phone_number") {
          return;
        }
        mappedErrors[key] = value;
      });

      setErrors(mappedErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-shell" aria-labelledby="signup-form-heading">
        <div className="signup-panel signup-panel-brand">
          <div className="signup-visual-copy">
            <p className="eyebrow">Join the marketplace</p>
            <h1 id="signup-form-heading">Create your student account.</h1>
          </div>

          <div className="signup-visual-frame">
            <img
              className="signup-visual-image"
              src="https://images.pexels.com/photos/8199770/pexels-photo-8199770.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Students sitting together and studying with books and a laptop."
            />
          </div>
        </div>

        <form className="signup-panel signup-form-panel signup-form" noValidate onSubmit={handleSubmit}>
          <div className="signup-form-heading">
            <p className="eyebrow">Create account</p>
            <h2>Create your account</h2>
          </div>

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
              <span>University</span>
              <input
                aria-invalid={Boolean(errors.university)}
                name="university"
                onChange={handleChange}
                placeholder="Enter your university"
                type="text"
                value={formData.university}
              />
              {errors.university ? (
                <small className="signup-error">{errors.university}</small>
              ) : null}
            </label>

            <label className="signup-field">
              <span>Phone number</span>
              <input
                aria-invalid={Boolean(errors.phoneNumber)}
                name="phoneNumber"
                onChange={handleChange}
                placeholder="Enter your phone number"
                type="tel"
                value={formData.phoneNumber}
              />
              {errors.phoneNumber ? (
                <small className="signup-error">{errors.phoneNumber}</small>
              ) : null}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {submitError ? <p className="signup-error signup-feedback">{submitError}</p> : null}
          {submitMessage ? <p className="signup-success">{submitMessage}</p> : null}

          <p className="signup-login-hint">
            Already have an account?{" "}
            <Link className="signup-inline-link" to={ROUTES.login}>
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
