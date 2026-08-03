interface ProductWindowProps {
  children: React.ReactNode;
}

export default function ProductWindow({ children }: ProductWindowProps) {
  return (
    <div className="neu-raised w-full rounded-3xl bg-surface">
      <div className="flex flex-col items-center gap-8 p-6 sm:p-10">{children}</div>
    </div>
  );
}
