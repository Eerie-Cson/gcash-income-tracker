"use client";
import React from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { fmt, fmtSmartDateTime } from "../../utils/formatters";
import { Transaction, TransactionType } from "@/utils/types";

export default function TransactionsList({
	transactions = [],
}: {
	transactions: Transaction[];
}) {
	return (
		<div className="divide-y divide-slate-100">
			{transactions.slice(0, 5).map((t) => {
				const isIn = t.transactionType === TransactionType.CASH_IN;
				return (
					<div
						key={t.id}
						className="flex items-center justify-between gap-4 py-2"
					>
						<div className="flex items-center gap-4 min-w-0">
							<div
								className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
									isIn
										? "bg-emerald-50 border-emerald-100"
										: "bg-blue-50 border-blue-100"
								}`}
							>
								{isIn ? (
									<ArrowDownCircle className="w-6 h-6 text-emerald-600" />
								) : (
									<ArrowUpCircle className="w-6 h-6 text-blue-600" />
								)}
							</div>

							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<div className="font-medium truncate">
										{isIn ? "Cash in" : "Cash out"}
									</div>
									<div className="text-xs text-slate-400">
										• {fmtSmartDateTime(t.transactionDate)}
									</div>
								</div>
								<div className="text-sm text-slate-500 truncate">
									Ref: #{t.referenceNumber} · {t.description}
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
