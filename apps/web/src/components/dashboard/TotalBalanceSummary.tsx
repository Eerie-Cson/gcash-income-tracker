import { useTransaction } from "@/hooks/useTransactions";
import { TrendingUp, Calendar, RefreshCw } from "lucide-react";
import React from "react";

// utils/timeAgo.ts
export function timeAgo(date?: Date | string): string {
	if (!date) return "No transactions yet";
	const now = new Date();

	// Force input date into a Date object
	const past = typeof date === "string" ? new Date(date) : date;

	// Convert both to "Philippine Standard Time" (UTC+8)
	const pstNow = new Date();
	// now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000
	const pstPast = past;
	// past.getTime() + past.getTimezoneOffset() * 60000 + 8 * 3600000

	const diffMs = pstNow.getTime() - pstPast.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHours = Math.floor(diffMin / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSec < 60) return "just now";
	if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	if (diffDays === 1) return "yesterday";
	return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const TotalBalanceSummary = ({
	totalBalance,
	accentBorderClass,
	accentClass,
}: any) => {
	const growthPercentage = 5.2;
	const isPositiveGrowth = growthPercentage > 0;
	const { transactions } = useTransaction();

	const lastUpdated =
		transactions.length > 0 && transactions[0].transactionDate
			? transactions[0].transactionDate
			: undefined;

	return (
		<section
			className={`bg-gradient-to-r from-slate-50 via-white to-${
				accentClass.split("-")[1]
			}-50 rounded-2xl p-6 shadow-sm border ${accentBorderClass} mb-8 relative overflow-hidden group hover:shadow-md transition-all duration-300`}
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div
					className={`absolute top-0 right-0 w-32 h-32 ${accentClass.replace(
						"text-",
						"bg-"
					)} rounded-full -translate-y-16 translate-x-16`}
				></div>
				<div
					className={`absolute bottom-0 left-0 w-24 h-24 ${accentClass
						.replace("text-", "bg-")
						.replace(
							"-600",
							"-300"
						)} rounded-full translate-y-12 -translate-x-12`}
				></div>
			</div>

			<div className="relative">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					{/* Main Balance Info */}
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<div className="flex items-center gap-2">
								<div
									className={`w-3 h-3 rounded-full ${accentClass.replace(
										"text-",
										"bg-"
									)} animate-pulse`}
								></div>
								<span className="text-sm text-slate-600 font-semibold uppercase tracking-wider">
									Total Balance
								</span>
							</div>
							<div className="hidden lg:block h-4 w-px bg-slate-200"></div>
							<div
								className={`hidden lg:flex items-center gap-1 ${
									isPositiveGrowth ? "text-emerald-600" : "text-rose-600"
								} text-sm font-medium`}
							>
								<TrendingUp
									className={`w-4 h-4 ${isPositiveGrowth ? "" : "rotate-180"}`}
								/>
								<span>
									{isPositiveGrowth ? "+" : ""}
									{growthPercentage}%
								</span>
							</div>
						</div>

						<div className="flex items-baseline gap-4">
							<span
								className={`text-4xl lg:text-4xl font-extralight ${accentClass} tracking-tight`}
							>
								₱{totalBalance.toLocaleString()}
							</span>
							<div
								className={`lg:hidden flex items-center gap-1 ${
									isPositiveGrowth ? "text-emerald-600" : "text-rose-600"
								} text-sm font-medium`}
							>
								<TrendingUp
									className={`w-4 h-4 ${isPositiveGrowth ? "" : "rotate-180"}`}
								/>
								<span>
									{isPositiveGrowth ? "+" : ""}
									{growthPercentage}%
								</span>
							</div>
						</div>

						<p className="text-slate-600 text-sm mt-2">
							Combined cash and digital wallet balance
						</p>
					</div>

					{/* Status Indicators */}
					<div className="flex flex-col lg:items-end gap-3">
						<div className="flex items-center gap-6 text-sm">
							<div className="flex items-center gap-2 text-slate-500">
								<RefreshCw className="w-4 h-4" />
								<span>Updated {timeAgo(lastUpdated)}</span>
							</div>
							<div className="hidden lg:flex items-center gap-2 text-slate-500">
								<Calendar className="w-4 h-4" />
								<span>This month</span>
							</div>
						</div>

						{/* Growth Indicator */}
						<div
							className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
								isPositiveGrowth
									? "bg-emerald-50 text-emerald-700 border border-emerald-200"
									: "bg-rose-50 text-rose-700 border border-rose-200"
							}`}
						>
							<div
								className={`w-2 h-2 rounded-full ${
									isPositiveGrowth ? "bg-emerald-500" : "bg-rose-500"
								}`}
							></div>
							<span>Monthly growth</span>
						</div>
					</div>
				</div>

				{/* Mobile Month Indicator */}
				<div className="lg:hidden flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
					<div className="flex items-center gap-2 text-slate-500 text-sm">
						<Calendar className="w-4 h-4" />
						<span>This month</span>
					</div>
					<div
						className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
							isPositiveGrowth
								? "bg-emerald-50 text-emerald-700 border border-emerald-200"
								: "bg-rose-50 text-rose-700 border border-rose-200"
						}`}
					>
						<div
							className={`w-2 h-2 rounded-full ${
								isPositiveGrowth ? "bg-emerald-500" : "bg-rose-500"
							}`}
						></div>
						<span>Monthly growth</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TotalBalanceSummary;
