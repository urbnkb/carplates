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
 *
 * Od `lg` dwie kolumny: wynik po lewej nie spycha już mapy pod ekran, więc
 * podświetlony powiat widać od razu po wpisaniu kodu.
 */
export default function ProductWindow({ children }: ProductWindowProps) {
  return (
    <div className="neu-raised w-full rounded-[25px] bg-edge p-px">
      <div className="grid items-start gap-8 rounded-3xl bg-surface p-6 sm:p-10 lg:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
