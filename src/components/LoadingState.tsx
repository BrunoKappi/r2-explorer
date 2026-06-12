/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function LoadingState() {
  const rows = Array.from({ length: 5 });

  return (
    <div className="w-full select-none font-sans">
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((_, index) => (
            <tr
              key={index}
              className="border-b border-zinc-100 dark:border-zinc-800/60 text-[12px] h-10 flex items-center w-full"
            >
              {/* Icon & Name */}
              <td className="pl-4 pr-3 py-2 flex items-center gap-2.5 flex-1 min-w-0">
                {/* Icon box skeleton */}
                <div className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0"></div>
                {/* Name line skeleton */}
                <div 
                  className="h-3.5 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded truncate"
                  style={{ width: `${Math.floor(Math.random() * 50) + 100}px` }}
                ></div>
              </td>

              {/* Size column */}
              <td className="px-3 py-2 w-24 shrink-0 flex justify-end">
                <div className="w-12 h-3 bg-zinc-50/70 dark:bg-zinc-800/50 animate-pulse rounded"></div>
              </td>

              {/* Date modified column */}
              <td className="px-3 py-2 w-48 shrink-0 hidden sm:flex justify-start">
                <div className="w-28 h-3 bg-zinc-50/70 dark:bg-zinc-800/50 animate-pulse rounded"></div>
              </td>

              {/* Mode column */}
              <td className="px-4 py-2 w-32 shrink-0 hidden md:flex justify-start">
                <div className="w-20 h-3 bg-zinc-50/70 dark:bg-zinc-800/50 animate-pulse rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
