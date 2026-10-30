"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCampusLocations, runNetworkTest } from "../services/networkTestService";

export function useNetworkTest() {
	const [locations, setLocations] = useState([]);
	const [selectedLocationId, setSelectedLocationId] = useState("");
	const [isLoadingLocations, setIsLoadingLocations] = useState(true);
	const [locationError, setLocationError] = useState("");
	const [status, setStatus] = useState("idle");
	const [error, setError] = useState("");
	const [result, setResult] = useState(null);
	const [locationRequest, setLocationRequest] = useState(0);
	const activeTest = useRef(null);

	useEffect(() => {
		const controller = new AbortController();
		getCampusLocations({ signal: controller.signal })
			.then((items) => {
				setLocations(items);
				setLocationError("");
			})
			.catch((cause) => {
				if (cause.name !== "AbortError") setLocationError(cause.message || "Campus locations could not be loaded.");
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoadingLocations(false);
			});
		return () => controller.abort();
	}, [locationRequest]);

	const retryLocations = useCallback(() => {
		setLocationError("");
		setIsLoadingLocations(true);
		setLocationRequest((request) => request + 1);
	}, []);

	const selectLocation = useCallback((locationId) => {
		setSelectedLocationId(locationId);
		setResult(null);
		setError("");
		setStatus("idle");
	}, []);

	const startTest = useCallback(async () => {
		if (activeTest.current) return;
		if (!selectedLocationId) {
			setError("Select a campus test location before starting.");
			setStatus("failed");
			return;
		}
		const controller = new AbortController();
		activeTest.current = controller;
		setError("");
		setResult(null);
		setStatus("running");
		try {
			const measurement = await runNetworkTest({ locationId: selectedLocationId, signal: controller.signal });
			if (controller.signal.aborted) return;
			setResult(measurement);
			setStatus("complete");
		} catch (cause) {
			if (controller.signal.aborted) {
				setError("Test cancelled. No measurement was recorded.");
				setStatus("idle");
				return;
			}
			setError(cause.message || "A network measurement could not be completed.");
			setStatus("failed");
		} finally {
			if (activeTest.current === controller) activeTest.current = null;
		}
	}, [selectedLocationId]);

	const cancelTest = useCallback(() => {
		activeTest.current?.abort();
	}, []);

	return {
		locations,
		selectedLocationId,
		setSelectedLocationId: selectLocation,
		isLoadingLocations,
		locationError,
		retryLocations,
		status,
		error,
		result,
		startTest,
		cancelTest,
	};
}
