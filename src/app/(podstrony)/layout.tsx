import SiteHeader from "@/components/SiteHeader";

/**
 * Wspólna obudowa podstron. Grupa `(podstrony)` nie zmienia adresów URL.
 * Nawigację w górę daje każda strona sama przez `Breadcrumbs`, bo tylko ona
 * zna swoją nazwę.
 *
 * `overflow-x-clip`, nie `hidden`: hidden robi z tego kontenera przewijanie
 * i `sticky` w środku (mapa, spis województw) przestaje działać.
 */
export default function PodstronyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-clip bg-surface">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-4 pb-14 sm:pb-20">
        {children}
      </main>
    </div>
  );
}
