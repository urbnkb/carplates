import Link from "next/link";
import PlateSearch from "@/components/PlateSearch";
import { getAllKody } from "@/lib/kody";
import { SITE_NAME } from "@/lib/site";

/** Kto wchodzi na podstronę z Google, od razu ma pod ręką narzędzie. */
export default function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 pt-5 pb-2">
      <Link href="/" className="text-base leading-tight font-extrabold tracking-tight text-zinc-900 sm:text-lg">
        {SITE_NAME}
      </Link>
      <PlateSearch kody={getAllKody().map(({ kod }) => kod)} />
    </header>
  );
}
