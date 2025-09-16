"use client";
import React from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { fmt, fmtDate, fmtTime } from "../../utils/formatters";

export default function TransactionsList({
	transactions = [],
	compact = false,
}: {
	transactions: any[];
	compact?: boolean;
}) {
	return (
		<div className="divide-y divide-slate-100">
			{transactions.slice(0, 10).map((t) => {
				const isIn = t.type === "cash-in";
				return (
					<div
						key={t.id}
						className={`py-4 flex items-center justify-between gap-4 ${
							compact ? "py-2" : "py-4"
						}`}
					>
						<div className="flex items-center gap-4 min-w-0">
							<div
								className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
									isIn
										? "bg-emerald-50 border-emerald-100"
										: "bg-rose-50 border-rose-100"
								}`}
							>
								{isIn ? (
									<ArrowDownCircle className="w-6 h-6 text-emerald-600" />
								) : (
									<ArrowUpCircle className="w-6 h-6 text-rose-600" />
								)}
							</div>

							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<div className="font-medium truncate">
										{isIn ? "Cash in" : "Cash out"}
									</div>
									<div className="text-xs text-slate-400">
										• {fmtDate(t.date)} {fmtTime(t.date)}
									</div>
								</div>
								<div className="text-sm text-slate-500 truncate">
									Ref: #{t.id} · sample note (tap to add)
								</div>
							</div>
						</div>

						<div className="text-right">
							<div className="font-semibold">{fmt(t.amount)}</div>
							<div
								className={`text-sm ${
									t.profit >= 0 ? "text-emerald-600" : "text-rose-600"
								}`}
							>
								{t.profit >= 0
									? `+${fmt(t.profit)}`
									: `-${fmt(Math.abs(t.profit))}`}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
