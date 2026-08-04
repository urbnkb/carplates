interface ProductWindowProps {
  children: React.ReactNode;
}

/**
 * Główna karta produktu. Cienka szara krawędź tylko domyka kształt — za wrażenie
 * unoszenia się odpowiada poświata z utility `neu-raised`, zgodnie ze stylistyką
 * neomorficzną. Zaokrąglenie zewnętrzne to 24 px wnętrza + 3 px krawędzi, żeby
 * oba promienie były koncentryczne.
 */
export default function ProductWindow({ children }: ProductWindowProps) {
  return (
    <div className="neu-raised w-full rounded-[27px] bg-edge p-[3px] sm:p-1">
      <div className="flex flex-col items-center gap-8 rounded-3xl bg-surface p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
