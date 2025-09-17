import Card from "@/ui/Card";
import MiniSpark from "@/ui/Minispark";
import React from "react";
import {
	Wallet,
	CreditCard,
	TrendingUp,
	TrendingDown,
	BanknoteArrowUp,
} from "lucide-react";

interface KpiCardsProps {
	balances: any;
	totalProfit: number;
	compact: boolean;
	accent: string;
	accentClass?: string;
}

const KpiCards = ({
	balances,
	totalProfit,
	compact,
	accentClass,
}: KpiCardsProps) => {
	// Calculate profit trend (you'd implement this based on historical data)
	const profitTrend = totalProfit >= 0 ? "up" : "down";
	const profitPercentage = 5.2; // This should be calculated from actual data

	const cards = [
		{
			title: "Cash",
			value: `₱${balances.cash.toLocaleString()}`,
			subtitle: "Physical cash on hand",
			icon: Wallet,
			sparkData: [1000, 120, 580, 150, 1100],
			iconColor: "text-indigo-600",
			useAccent: false,
			bgColor: `bg-indigo-100`,
		},
		{
			title: "GCash",
			value: `₱${balances.gcash.toLocaleString()}`,
			subtitle: "Digital wallet",
			iconColor: "text-green-600",
			icon: BanknoteArrowUp,
			sparkData: [8, 10, 9, 12, 14],
			useAccent: false, // Use accent color for this card
			bgColor: `bg-green-100`,
		},
		{
			title: "Profit",
			value: `₱${totalProfit.toLocaleString()}`,
			subtitle: "Period to date",
			icon: totalProfit >= 0 ? TrendingUp : TrendingDown,
			trend: {
				value: profitPercentage,
				direction: profitTrend,
				isPositive: totalProfit >= 0,
			},
			iconColor: totalProfit >= 0 ? "text-emerald-600" : "text-rose-600",
			bgColor: totalProfit >= 0 ? "bg-emerald-50" : "bg-rose-50",
			borderColor: totalProfit >= 0 ? "border-emerald-100" : "border-rose-100",
		},
	];

	return (
		<section
			className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  ${
				compact ? "gap-3" : "gap-6"
			} mb-8`}
		>
			{cards.map((card) => {
				const IconComponent = card.icon;

				return (
					<div
						key={card.title}
						className={`bg-gradient-to-b from-slate-50 to-green-50 rounded-2xl p-6 shadow-sm ${
							card.title === "Profit" ? `border ${card.borderColor}` : {}
						} hover:shadow-lg transition-all duration-300 group`}
					>
						{/* Header with icon and title */}
						<div className="flex items-start justify-between mb-4">
							<div
								className={`p-3 rounded-xl ${card.bgColor} ${
									card.title === "Profit" ? `border  ${card.borderColor}` : {}
								}  group-hover:scale-105 transition-transform duration-200`}
							>
								<IconComponent className={`w-6 h-6 ${card.iconColor}`} />
							</div>
							<div className="text-right">
								<p className="text-sm text-slate-600 font-medium">
									{card.title}
								</p>
								<p className="text-xs text-slate-500">{card.subtitle}</p>
							</div>
						</div>

						{/* Value */}
						<div className="mb-4">
							<p
								className={`text-3xl font-bold ${
									card.title === "Profit"
										? totalProfit >= 0
											? "text-emerald-700"
											: "text-rose-700"
										: card.useAccent
										? accentClass
										: "text-slate-800"
								}`}
							>
								{card.value}
							</p>
						</div>

						{/* Footer - Sparkline or Trend */}
						<div className="flex items-center justify-between">
							{card.sparkData ? (
								<div className="flex-1">
									<MiniSpark
										values={card.sparkData}
										accent={`${card.title === ""}`}
									/>
								</div>
							) : card.trend ? (
								<div
									className={`flex items-center gap-2 text-sm font-semibold ${
										card.trend.isPositive ? "text-emerald-600" : "text-rose-600"
									}`}
								>
									<IconComponent className="w-4 h-4" />
									<span>
										{card.trend.direction === "up" ? "+" : "-"}
										{Math.abs(card.trend.value)}%
									</span>
								</div>
							) : null}

							<div className="text-xs text-slate-400">Updated now</div>
						</div>
					</div>
				);
			})}
		</section>
	);
};

export default KpiCards;
