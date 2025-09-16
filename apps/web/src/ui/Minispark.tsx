"use client";
import React from "react";

export default function MiniSpark({ values = [], accent = "emerald" }: any) {
	if (!values || values.length === 0) return null;
	const max = Math.max(...values);
	const points = values
		.map(
			(v: number, i: number) =>
				`${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`
		)
		.join(" ");

	const stroke =
		accent === "indigo"
			? "#6366f1"
			: accent === "slate"
			? "#64748b"
			: "#10b981";

	return (
		<svg
			viewBox="0 0 100 100"
			className="w-full h-10"
			preserveAspectRatio="none"
		>
			<polyline
				fill="none"
				strokeWidth={2}
				stroke={stroke}
				points={points}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
