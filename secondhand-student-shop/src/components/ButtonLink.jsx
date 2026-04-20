import { Link } from "react-router-dom";

export function ButtonLink({
  href,
  to,
  children,
  variant = "primary",
  onClick,
  type = "button",
}) {
  const className = `button-link button-link-${variant}`;

  if (to) {
    return (
      <Link className={className} onClick={onClick} to={to}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
