"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MapPin, RadioTower, Wifi } from "lucide-react";
import LocationSelector from "../../components/network-test/LocationSelector";
import TestControls from "../../components/network-test/TestControls";
import TestProgress from "../../components/network-test/TestProgress";
import TestResults from "../../components/network-test/TestResults";
import { useNetworkTest } from "../../hooks/useNetworkTest";

export default function NetworkTestPage() {
	const {
		locations,
		selectedLocationId,
		setSelectedLocationId,
		isLoadingLocations,
		locationError,
		retryLocations,
		status,
		error,
		result,
		startTest,
		cancelTest,
	} = useNetworkTest();

	const selectedLocation = useMemo(
		() => locations.find((location) => String(location.id) === selectedLocationId) ?? null,
		[locations, selectedLocationId],
	);

	return (
		<main className="min-h-full bg-[#F5F7FB] text-[#172033]">
			<div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#E4E7EC] pb-5">
					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#667085]">CampusSignal / Network testing</p>
						<h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">Network test</h1>
						<p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
							Choose a campus location and check its Wi-Fi performance when a measurement target is available.
						</p>
					</div>
					<Link href="/locations" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 text-sm font-medium text-[#344054] transition hover:border-[#2563EB] hover:text-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">
						<MapPin size={16} aria-hidden="true" /> Browse locations
					</Link>
				</header>

				<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
					<div className="space-y-5">
						<section aria-labelledby="location-title" className="rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6">
							<div className="mb-5 flex items-start gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]"><MapPin size={19} aria-hidden="true" /></span>
								<div><h2 id="location-title" className="text-base font-semibold">Test location</h2><p className="mt-1 text-sm text-[#667085]">Select where you are checking connectivity.</p></div>
							</div>
							<LocationSelector
								locations={locations}
								value={selectedLocationId}
								onChange={setSelectedLocationId}
								isLoading={isLoadingLocations}
								isTesting={status === "running"}
								error={locationError}
								onRetry={retryLocations}
							/>
							<div className="mt-5 border-t border-[#EAECF0] pt-5">
								<TestControls status={status} hasLocation={Boolean(selectedLocation)} onStart={startTest} onCancel={cancelTest} error={error} />
							</div>
						</section>

						<section aria-labelledby="progress-title" className="rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6">
							<div className="mb-4 flex items-center gap-3">
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDFF] text-[#0891B2]"><Wifi size={18} aria-hidden="true" /></span>
								<div><h2 id="progress-title" className="text-base font-semibold">Test progress</h2><p className="mt-0.5 text-sm text-[#667085]">Connection and throughput stages</p></div>
							</div>
							<TestProgress status={status} />
						</section>

						<TestResults result={result} location={selectedLocation} />
					</div>

					<aside className="rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="location-context-title">
						<div className="flex items-center gap-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#475467]"><RadioTower size={18} aria-hidden="true" /></span>
							<div><h2 id="location-context-title" className="text-base font-semibold">Selected location</h2><p className="mt-0.5 text-sm text-[#667085]">Campus test context</p></div>
						</div>
						{selectedLocation ? (
							<dl className="mt-5 divide-y divide-[#EAECF0] rounded-lg border border-[#EAECF0] px-4">
								<Detail label="Building" value={selectedLocation.buildingName} />
								{selectedLocation.floor != null && <Detail label="Floor" value={String(selectedLocation.floor)} />}
								{selectedLocation.zoneName && <Detail label="Zone" value={selectedLocation.zoneName} />}
								{selectedLocation.description && <Detail label="Details" value={selectedLocation.description} />}
							</dl>
						) : (
							<div className="mt-5 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-5 text-center">
								<MapPin size={20} className="mx-auto text-[#98A2B3]" aria-hidden="true" />
								<p className="mt-2 text-sm font-medium text-[#344054]">No location selected</p>
								<p className="mt-1 text-xs leading-5 text-[#667085]">Choose a location to see its available building, floor, and zone details.</p>
							</div>
						)}
						<p className="mt-4 text-xs leading-5 text-[#667085]">Location detail depends on the information returned by the campus locations service.</p>
					</aside>
				</div>
			</div>
		</main>
	);
}

function Detail({ label, value }) {
	return <div className="py-3 first:pt-4 last:pb-4"><dt className="text-xs font-medium text-[#667085]">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-[#172033]">{value}</dd></div>;
}
