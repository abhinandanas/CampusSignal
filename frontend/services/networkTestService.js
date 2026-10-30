const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function readJson(response) {
	const body = await response.json().catch(() => null);
	if (!response.ok) {
		const detail = Array.isArray(body?.details) ? body.details.join(" ") : "";
		throw new Error([body?.message, detail].filter(Boolean).join(": ") || `Request failed (${response.status}).`);
	}
	return body;
}

function normalizeLocation(location) {
	if (!location || location.id == null) return null;
	return {
		...location,
		id: location.id,
		buildingName: location.buildingName ?? location.building_name ?? location.name ?? "Campus location",
		floor: location.floor ?? null,
		zoneName: location.zoneName ?? location.zone_name ?? location.name ?? null,
		description: location.description ?? "",
	};
}

export async function getCampusLocations({ signal } = {}) {
	const response = await fetch(`${API_BASE_URL}/locations`, { signal, headers: { Accept: "application/json" } });
	const body = await readJson(response);
	const records = Array.isArray(body) ? body : body?.data;
	if (!Array.isArray(records)) throw new Error("The locations API returned an unsupported response.");
	return records.map(normalizeLocation).filter(Boolean);
}

// The current backend accepts persisted measurements but does not expose a probe
// endpoint. Keep that limitation explicit instead of manufacturing measurements.
export async function runNetworkTest({ locationId, signal }) {
	if (!locationId) throw new Error("Select a campus test location before starting.");
	if (signal?.aborted) throw new DOMException("Test cancelled.", "AbortError");
	throw new Error("Live measurement is unavailable: the backend has no campus probe endpoint configured. No test was recorded.");
}

// Used only once a real client measurement has been captured by an approved probe.
export async function saveNetworkTest({ locationId, downloadMbps, uploadMbps, latencyMs, measurementSource = "browser" }) {
	const response = await fetch(`${API_BASE_URL}/tests`, {
		method: "POST",
		headers: { Accept: "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({ locationId: Number(locationId), downloadMbps, uploadMbps, latencyMs, measurementSource }),
	});
	const body = await readJson(response);
	if (!body?.data) throw new Error("The tests API returned an unsupported response.");
	return body.data;
}
