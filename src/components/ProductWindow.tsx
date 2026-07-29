interface ProductWindowProps {
  children: React.ReactNode;
}

export default function ProductWindow({ children }: ProductWindowProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div className="flex flex-col items-center gap-8 p-6 sm:p-10">{children}</div>
    </div>
  );
}
