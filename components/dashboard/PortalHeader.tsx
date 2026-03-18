import type { ReactNode } from "react";

export default function PortalHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{description}</p>
        ) : null}
      </div>

      {actions ? <div>{actions}</div> : null}
    </div>
  );
}