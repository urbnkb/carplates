/** Kolorowa obwoluta rozróżnia dwa światy aplikacji: tablicę i powiat. */
export type WindowAccent = "plate" | "location" | "neutral";

const SLEEVE: Record<WindowAccent, string> = {
  plate: "bg-linear-to-br from-blue-500 to-blue-700",
  location: "bg-linear-to-br from-emerald-500 to-emerald-700",
  neutral: "bg-linear-to-br from-zinc-300 to-zinc-400",
};

interface ProductWindowProps {
  children: React.ReactNode;
  accent?: WindowAccent;
}

export default function ProductWindow({ children, accent = "neutral" }: ProductWindowProps) {
  return (
    <div className={`neu-raised w-full rounded-[1.75rem] p-2 sm:p-2.5 ${SLEEVE[accent]}`}>
      <div className="flex flex-col items-center gap-8 rounded-3xl bg-surface p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
