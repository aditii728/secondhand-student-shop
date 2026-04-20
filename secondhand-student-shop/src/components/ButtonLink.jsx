export function ButtonLink({ href, children, variant = "primary", onClick, type = "button" }) {
  const className = `button-link button-link-${variant}`;

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
