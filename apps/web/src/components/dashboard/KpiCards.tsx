import { useTransactions } from "@/contexts/TransactionsContext";
import MiniSpark from "@/ui/Minispark";
import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
enum WalletType {
	gcash = "gcash",
	cash = "cash",
}

interface KpiCardsProps {
	balances: Record<WalletType, number>;
	totalProfit: number;
}

export function timeAgo(date?: Date | string): string {
	if (!date) return "No transactions yet";

	const past = typeof date === "string" ? new Date(date) : date;

	const pstNow = new Date();
	const pstPast = past;

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

const KpiCards = ({ balances, totalProfit }: KpiCardsProps) => {
	const { transactions } = useTransactions();

	const lastUpdated =
		transactions.length > 0 && transactions[0].transactionDate
			? transactions[0].transactionDate
			: undefined;
	const profitTrend = totalProfit >= 0 ? "up" : "down";
	const profitPercentage = 5.2;

	const cards = [
		{
			title: "GCash",
			value: `₱${balances.gcash.toLocaleString()}`,
			subtitle: "Digital wallet",
			iconColor: "text-blue-600",
			icon: CreditCard,
			sparkData: [8, 10, 9, 12, 14],
			bgColor: "bg-blue-100",
		},
		{
			title: "Cash",
			value: `₱${balances.cash.toLocaleString()}`,
			subtitle: "Physical cash on hand",
			icon: Wallet,
			sparkData: [1000, 120, 580, 150, 1100],
			iconColor: "text-green-600",
			bgColor: "bg-green-100",
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
		<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			{cards.map((card) => {
				const IconComponent = card.icon;

				return (
					<div
						key={card.title}
						className={`bg-gradient-to-b from-slate-50 to-green-50 rounded-2xl p-6 shadow-sm ${
							card.title === "Profit" ? `border ${card.borderColor}` : ""
						} hover:shadow-lg transition-all duration-300 group`}
					>
						{/* Header with icon and title */}
						<div className="flex items-start justify-between mb-4">
							<div
								className={`p-3 rounded-xl ${card.bgColor} ${
									card.title === "Profit" ? `border ${card.borderColor}` : ""
								} group-hover:scale-105 transition-transform duration-200`}
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
										: card.iconColor
								}`}
							>
								{card.value}
							</p>
						</div>

						{/* Footer - Sparkline or Trend */}
						<div className="flex items-center justify-between">
							{card.sparkData ? (
								<div className="flex-1">
									<MiniSpark values={card.sparkData} />
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

							<div className="text-xs text-slate-400">
								Updated {timeAgo(lastUpdated)}
							</div>
						</div>
					</div>
				);
			})}
		</section>
	);
};

export default KpiCards;
