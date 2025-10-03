"use client";
import React from "react";
import { X } from "lucide-react";
import { Accent, FontSize } from "@/utils/types";

export default function SettingsPanel({
	open,
	setOpen,
	fontSize,
	setFontSize,
	compact,
	setCompact,
	accent,
	setAccent,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	fontSize: FontSize;
	setFontSize: (fontSize: FontSize) => void;
	compact: boolean;
	setCompact: (compact: boolean) => void;
	accent: Accent;
	setAccent: (accent: Accent) => void;
}) {
	return (
		<div
			className={`fixed right-0 top-0 h-full z-50 transform transition-transform duration-200 ${
				open ? "translate-x-0" : "translate-x-full"
			}`}
			style={{ width: 340 }}
		>
			<div className="h-full bg-white border-l shadow-2xl p-6 overflow-auto">
				<div className="flex items-center justify-between mb-4">
					<div>
						<div className="text-lg font-semibold">Settings</div>
						<div className="text-xs text-slate-500">
							Personalize your dashboard
						</div>
					</div>
					<button
						onClick={() => setOpen(false)}
						className="p-2 rounded-md hover:bg-slate-50"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<div className="text-sm font-medium">Font size</div>
						<div className="mt-2 flex gap-2">
							<button
								onClick={() => setFontSize("small")}
								className={`px-3 py-2 rounded-lg border ${
									fontSize === "small" ? "bg-slate-100" : "bg-white"
								}`}
							>
								Small
							</button>
							<button
								onClick={() => setFontSize("medium")}
								className={`px-3 py-2 rounded-lg border ${
									fontSize === "medium" ? "bg-slate-100" : "bg-white"
								}`}
							>
								Medium
							</button>
							<button
								onClick={() => setFontSize("large")}
								className={`px-3 py-2 rounded-lg border ${
									fontSize === "large" ? "bg-slate-100" : "bg-white"
								}`}
							>
								Large
							</button>
						</div>
					</div>

					<div>
						<div className="text-sm font-medium">Layout density</div>
						<div className="mt-2 flex items-center gap-3">
							<label className="inline-flex items-center gap-2">
								<input
									type="checkbox"
									checked={compact}
									onChange={(e) => setCompact(e.target.checked)}
								/>
								<span className="text-sm text-slate-600">Compact rows</span>
							</label>
						</div>
					</div>

					<div>
						<div className="text-sm font-medium">Accent color</div>
						<div className="mt-2 flex items-center gap-2">
							<button
								onClick={() => setAccent("torquoise")}
								className={`w-8 h-8 rounded-full ${
									accent === "torquoise" ? "ring-2 ring-[#ade7fb]" : "ring-0"
								}`}
								style={{
									background: "linear-gradient(180deg,#c7effc,#ade7fb)",
								}}
							/>
							<button
								onClick={() => setAccent("emerald")}
								className={`w-8 h-8 rounded-full ${
									accent === "emerald" ? "ring-2 ring-emerald-200" : "ring-0"
								}`}
								style={{
									background: "linear-gradient(180deg,#ECFDF5,#D1FAE5)",
								}}
							/>
							<button
								onClick={() => setAccent("indigo")}
								className={`w-8 h-8 rounded-full ${
									accent === "indigo" ? "ring-2 ring-indigo-200" : "ring-0"
								}`}
								style={{
									background: "linear-gradient(180deg,#EEF2FF,#E0E7FF)",
								}}
							/>
							<button
								onClick={() => setAccent("slate")}
								className={`w-8 h-8 rounded-full ${
									accent === "slate" ? "ring-2 ring-slate-200" : "ring-0"
								}`}
								style={{
									background: "linear-gradient(180deg,#F8FAFC,#F1F5F9)",
								}}
							/>
						</div>
					</div>

					<div className="pt-4 border-t">
						<div className="text-sm text-slate-500">
							Preferences are saved locally in your browser.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
