"use client";

import { useMemo, useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

const fieldClass = "mt-1.5 block min-h-11 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:bg-[#F2F4F7] disabled:text-[#667085]";

function unique(values) {
	return [...new Set(values.filter((value) => value !== undefined && value !== null && value !== "").map(String))];
}

export default function LocationSelector({ locations, value, onChange, isLoading, isTesting = false, error, onRetry }) {
	const selected = locations.find((location) => String(location.id) === value);
	const hasHierarchy = locations.length > 0 && locations.every((location) => location.floor != null && location.zoneName);
	const buildings = useMemo(() => unique(locations.map((location) => location.buildingName)), [locations]);
	const [draftBuilding, setDraftBuilding] = useState("");
	const [draftFloor, setDraftFloor] = useState("");
	const building = selected?.buildingName ?? draftBuilding;
	const floor = selected?.floor == null ? draftFloor : String(selected.floor);
	const buildingLocations = locations.filter((location) => location.buildingName === building);
	const floors = unique(buildingLocations.map((location) => location.floor));
	const floorLocations = buildingLocations.filter((location) => String(location.floor) === floor);

	return (
		<div className="space-y-4">
			{isLoading && <p role="status" className="flex items-center gap-2 text-sm text-[#667085]"><LoaderCircle size={16} className="animate-spin text-[#2563EB]" aria-hidden="true" />Loading campus locations…</p>}
			{hasHierarchy ? (
				<>
					<label className="block text-sm font-medium text-[#344054]" htmlFor="test-building">Building
						<select id="test-building" className={fieldClass} value={building} onChange={(event) => { setDraftBuilding(event.target.value); setDraftFloor(""); onChange(""); }} disabled={isLoading || isTesting || buildings.length === 0}>
							<option value="">Select a building</option>
							{buildings.map((name) => <option key={name} value={name}>{name}</option>)}
						</select>
					</label>
					<div className="grid gap-4 sm:grid-cols-2">
						<label className="block text-sm font-medium text-[#344054]" htmlFor="test-floor">Floor
							<select id="test-floor" className={fieldClass} value={floor} onChange={(event) => { setDraftFloor(event.target.value); onChange(""); }} disabled={isTesting || !building || floors.length === 0}>
								<option value="">Select a floor</option>
								{floors.map((item) => <option key={item} value={item}>Floor {item}</option>)}
							</select>
						</label>
						<label className="block text-sm font-medium text-[#344054]" htmlFor="test-zone">Zone or room
							<select id="test-zone" className={fieldClass} value={selected?.zoneName ?? ""} onChange={(event) => { const match = floorLocations.find((location) => location.zoneName === event.target.value); onChange(match ? String(match.id) : ""); }} disabled={isTesting || !floor || floorLocations.length === 0}>
								<option value="">Select a zone</option>
								{floorLocations.map((location) => <option key={location.id} value={location.zoneName}>{location.zoneName}</option>)}
							</select>
						</label>
					</div>
				</>
			) : (
				<label className="block text-sm font-medium text-[#344054]" htmlFor="test-location">Campus location
					<select id="test-location" className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} disabled={isLoading || isTesting || locations.length === 0}>
						<option value="">{isLoading ? "Loading campus locations…" : "Select a campus location"}</option>
						{locations.map((location) => <option key={location.id} value={String(location.id)}>{location.name ?? location.buildingName}{location.description ? ` — ${location.description}` : ""}</option>)}
					</select>
				</label>
			)}
			{error ? (
				<div role="alert" className="flex items-start gap-2 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] p-3 text-sm leading-5 text-[#B42318]">
					<AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
					<span className="min-w-0 flex-1">{error}</span>
					<button type="button" onClick={onRetry} disabled={isLoading} className="shrink-0 font-semibold underline underline-offset-2 disabled:opacity-50">Retry</button>
				</div>
			) : !isLoading && locations.length === 0 ? (
				<p className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-3 text-sm leading-5 text-[#667085]">No campus locations are available yet.</p>
			) : null}
		</div>
	);
}
