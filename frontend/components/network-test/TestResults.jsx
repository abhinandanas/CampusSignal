import { AlertCircle, CheckCircle2 } from "lucide-react";

const fields = [
	["downloadSpeedMbps", "download_mbps", "Download", "Mbps"],
	["uploadSpeedMbps", "upload_mbps", "Upload", "Mbps"],
	["latencyMs", "latency_ms", "Latency", "ms"],
];

const qualityStyles = {
	good: "border-[#ABEFC6] bg-[#ECFDF3] text-[#067647]",
	fair: "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]",
	weak: "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]",
};

function formatMetric(value) {
	if (value === null || value === undefined || value === "") return "—";
	const number = Number(value);
	return Number.isFinite(number) ? number.toFixed(2) : "—";
}

function formatTimestamp(value) {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
}

export default function TestResults({ result, location }) {
	if (!result) {
		return (
			<section aria-labelledby="result-title" className="rounded-xl border border-dashed border-[#D0D5DD] bg-white p-5 sm:p-6">
				<div className="flex items-start gap-3">
					<AlertCircle size={18} className="mt-0.5 shrink-0 text-[#667085]" aria-hidden="true" />
					<div>
						<h2 id="result-title" className="text-base font-semibold text-[#172033]">Test results</h2>
						<p className="mt-1 text-sm leading-5 text-[#667085]">Results will appear after a real measurement completes. No sample values are shown.</p>
					</div>
				</div>
			</section>
		);
	}

	const quality = String(result.status ?? result.qualityCategory ?? "").toLowerCase();
	const qualityLabel = { good: "Good", fair: "Fair", weak: "Weak", moderate: "Moderate", poor: "Poor" }[quality];
	const qualityClass = qualityStyles[quality] ?? (quality === "moderate" ? qualityStyles.fair : quality === "poor" ? qualityStyles.weak : "border-[#D0D5DD] bg-[#F9FAFB] text-[#475467]");
	const recordedAt = formatTimestamp(result.recordedAt ?? result.created_at);
	const locationName = result.location_name ?? result.locationName ?? (location ? [location.buildingName, location.floor == null ? null : `Floor ${location.floor}`, location.zoneName].filter(Boolean).join(" · ") : null);

	return (
		<section aria-labelledby="result-title" className="rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<CheckCircle2 size={18} className="text-[#079455]" aria-hidden="true" />
					<h2 id="result-title" className="text-base font-semibold text-[#172033]">Test results</h2>
				</div>
				{qualityLabel && <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${qualityClass}`}>{qualityLabel} coverage</span>}
			</div>
			<dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
				{fields.map(([key, backendKey, label, unit]) => (
					<div key={key} className="rounded-lg border border-[#EAECF0] bg-[#FCFCFD] p-4">
						<dt className="text-sm font-medium text-[#667085]">{label}</dt>
						<dd className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[#172033]">{formatMetric(result[key] ?? result[backendKey])}<span className="ml-1.5 text-sm font-normal text-[#667085]">{unit}</span></dd>
					</div>
				))}
			</dl>
			<div className="mt-4 flex flex-col gap-1 border-t border-[#EAECF0] pt-3 text-sm text-[#667085] sm:flex-row sm:flex-wrap sm:justify-between">
				{locationName && <p><span className="font-medium text-[#344054]">Location:</span> {locationName}</p>}
				{recordedAt && <p><span className="font-medium text-[#344054]">Test time:</span> {recordedAt}</p>}
			</div>
		</section>
	);
}
