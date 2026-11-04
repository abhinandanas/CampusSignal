import { AlertCircle, Check, Circle, LoaderCircle, Radio, Signal } from "lucide-react";

const stages = ["Connecting", "Latency", "Download", "Upload", "Finalizing"];

export default function TestProgress({ status }) {
	const isRunning = status === "running";
	const isComplete = status === "complete";
	const isFailed = status === "failed";
	const activeStage = isComplete ? stages.length : 0;
	const title = isRunning ? "Test in progress" : isComplete ? "Test complete" : isFailed ? "Test unavailable" : "Waiting for a test target";
	const description = isRunning
		? "The measurement service is processing this test."
		: isComplete
			? "Measurement stages have finished."
			: isFailed
				? "No measurement was captured or saved."
				: "Stages will begin when a campus probe is configured.";

	return (
		<div>
			<div aria-live="polite" className="flex items-center gap-4 rounded-lg bg-[#F9FAFB] px-4 py-4">
				<span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${isRunning ? "border-[#93C5FD] bg-[#EFF6FF] text-[#2563EB]" : isComplete ? "border-[#ABEFC6] bg-[#ECFDF3] text-[#079455]" : isFailed ? "border-[#FDA29B] bg-[#FEF3F2] text-[#D92D20]" : "border-[#EAECF0] bg-white text-[#667085]"}`}>
					{isRunning ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : isComplete ? <Check size={20} aria-hidden="true" /> : isFailed ? <AlertCircle size={20} aria-hidden="true" /> : <Signal size={20} aria-hidden="true" />}
				</span>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-[#172033]">{title}</p>
					<p className="mt-0.5 text-sm leading-5 text-[#667085]">{description}</p>
				</div>
				{isRunning && <Radio className="shrink-0 animate-pulse text-[#2563EB]" size={19} aria-label="Measurement active" />}
			</div>

			<ol aria-label="Network test stages" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
				{stages.map((stage, index) => {
					const complete = index < activeStage;
					const current = isRunning && index === 0;
					return (
						<li key={stage} className="flex min-w-0 items-center gap-3">
							<span className={complete ? "text-[#079455]" : current ? "text-[#2563EB]" : "text-[#98A2B3]"}>
								{complete ? <Check size={15} aria-hidden="true" /> : current ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Circle size={15} aria-hidden="true" />}
							</span>
							<span className={`text-sm ${complete || current ? "font-medium text-[#344054]" : "text-[#667085]"}`}>{stage}</span>
							{current && <span className="ml-auto text-xs font-medium text-[#2563EB]">In progress</span>}
						</li>
					);
				})}
			</ol>
		</div>
	);
}
