interface ProductWindowProps {
  children: React.ReactNode;
}

/**
 * Główna karta produktu. Szara krawędź to włos szerokości piksela — tylko
 * domyka kształt, resztę roboty robi cień z utility `neu-raised`. Grubość jest
 * stała na wszystkich szerokościach: przy takim cieniu każdy grubszy pasek
 * zaczyna wyglądać jak zwykły border i dociąża kartę.
 *
 * Zaokrąglenie zewnętrzne to 24 px wnętrza + 1 px krawędzi, żeby oba promienie
 * były koncentryczne.
 */
export default function ProductWindow({ children }: ProductWindowProps) {
  return (
    <div className="neu-raised w-full rounded-[25px] bg-edge p-px">
      <div className="flex flex-col items-center gap-8 rounded-3xl bg-surface p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}
