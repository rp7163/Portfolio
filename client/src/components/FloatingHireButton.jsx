import { Handshake } from "lucide-react";

/* Always-visible floating button at the bottom-right.
   Opens the hire modal when clicked.
   Has a small pulse ring to draw the eye. */
export default function FloatingHireButton({ onClick }) {
  return (
    <button
      type="button"
      className="floating-hire"
      onClick={onClick}
      aria-label="I'm hiring — share role details"
      title="I'm Hiring — Share Role Details"
    >
      <span className="floating-hire-pulse" />
      <span className="floating-hire-icon">
        <Handshake size={22} />
      </span>
      <span className="floating-hire-label">
        <span className="floating-hire-eyebrow">For recruiters</span>
        <span className="floating-hire-title">I'm Hiring</span>
      </span>
    </button>
  );
}
