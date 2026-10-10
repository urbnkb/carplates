/**
 * Wspólna obudowa podstron. Grupa `(podstrony)` nie zmienia adresów URL.
 * Nawigację w górę daje każda strona sama przez `Breadcrumbs`, bo tylko ona
 * zna swoją nazwę.
 */
export default function PodstronyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-14 sm:py-20">
        {children}
      </main>
    </div>
  );
}
