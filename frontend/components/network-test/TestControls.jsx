import { AlertTriangle, LoaderCircle, Play, RotateCcw, Square } from "lucide-react";

export default function TestControls({ status, hasLocation, onStart, onCancel, error }) {
	const isRunning = status === "running";

	return (
		<div aria-busy={isRunning}>
			<div className="flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={isRunning ? onCancel : onStart}
					disabled={!isRunning && !hasLocation}
					className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#D0D5DD] ${isRunning ? "bg-[#475467] hover:bg-[#344054]" : "bg-[#2563EB] hover:bg-[#1D4ED8]"}`}
				>
					{isRunning ? <><Square size={15} aria-hidden="true" /> Cancel test</> : <><Play size={16} aria-hidden="true" /> Start speed test</>}
				</button>
				{isRunning && <span className="inline-flex items-center gap-2 text-sm text-[#475467]"><LoaderCircle size={16} className="animate-spin text-[#2563EB]" aria-hidden="true" />Test running</span>}
				{status === "complete" && (
					<button type="button" onClick={onStart} disabled={!hasLocation} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#475467] transition hover:bg-[#F2F4F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50">
						<RotateCcw size={15} aria-hidden="true" /> Run again
					</button>
				)}
			</div>
			{error ? (
				<p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-[#FEC84B] bg-[#FFFAEB] p-3 text-sm leading-5 text-[#93370D]">
					<AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{error}</span>
				</p>
			) : !hasLocation ? (
				<p className="mt-3 text-sm text-[#667085]">Select a campus location to enable testing.</p>
			) : (
				<p className="mt-3 text-sm leading-5 text-[#667085]">A configured campus measurement target is required to collect real speed and latency values.</p>
			)}
		</div>
	);
}
