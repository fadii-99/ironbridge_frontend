import { BarLoader } from "react-spinners";

// Tailwind yellow-300 hex
const YELLOW_300 = "#fde047";

export default function Loader({
  color = YELLOW_300,
  speed = 1,
  fullscreen = true,
  label = "Initializing systems…",
}) {
  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[9999] grid place-items-center bg-neutral-950/70 backdrop-blur-sm"
          : "grid place-items-center p-6"
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="w-[min(86vw,420px)]">
        <BarLoader color={color} width="100%" speedMultiplier={speed} />
        <p className="mt-3 text-center text-xs tracking-wide text-white/80">
          {label}
        </p>
      </div>
    </div>
  );
}
