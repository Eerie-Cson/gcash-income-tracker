"use client";
import { useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";
type Accent = "slate" | "torquoise" | "emerald" | "indigo";

export function useLocalSettings(initial: {
	fontSize?: FontSize;
	compact?: boolean;
	accent?: Accent;
}) {
	const [fontSize, setFontSize] = useState<FontSize>(
		initial.fontSize ?? "large"
	);
	const [compact, setCompact] = useState<boolean>(initial.compact ?? false);
	const [accent, setAccent] = useState<Accent>(initial.accent ?? "emerald");

	useEffect(() => {
		try {
			const raw = localStorage.getItem("rd-dashboard-settings");
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed.fontSize) setFontSize(parsed.fontSize);
				if (typeof parsed.compact === "boolean") setCompact(parsed.compact);
				if (parsed.accent) setAccent(parsed.accent);
			}
		} catch (e) {
			alert(e);
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(
				"rd-dashboard-settings",
				JSON.stringify({ fontSize, compact, accent })
			);
		} catch (e) {}
	}, [fontSize, compact, accent]);

	return { fontSize, setFontSize, compact, setCompact, accent, setAccent };
}
