import EuStars from "@/components/EuStars";

interface PlatePreviewProps {
  code: string;
}

export default function PlatePreview({ code }: PlatePreviewProps) {
  return (
    <div className="inline-flex h-11 w-28 items-stretch overflow-hidden rounded-md border-[3px] border-black bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] sm:h-14 sm:w-36">
      <div className="flex w-6 flex-col items-center justify-between bg-[#003399] py-1 sm:w-8">
        <EuStars className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-[7px] font-bold text-white sm:text-[9px]">PL</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center px-1">
        <span className="font-mono text-base font-bold tracking-[0.1em] text-black sm:text-xl">
          {code}
        </span>
      </div>
    </div>
  );
}
