import { DashboardStats } from "@/api/report";
import { Activity, Calendar, DollarSign, TrendingUp } from "lucide-react";

const Stats = ({ dashboardStats }: { dashboardStats: DashboardStats }) => {
	const stats = [
		{
			key: "todayCount",
			label: "Today's Transactions",
			value: dashboardStats.todayCount,
			subtitle: "transactions today",
			icon: Activity,
			color: "blue",
			colorClasses: "text-blue-600 bg-blue-50 border-blue-100",
		},
		{
			key: "weeklyAverage",
			label: "Weekly Average",
			value: `₱${dashboardStats.weeklyAverage.toLocaleString()}`,
			subtitle: "per day",
			icon: TrendingUp,
			color: "purple",
			colorClasses: "text-purple-600 bg-purple-50 border-purple-100",
		},
		{
			key: "largestTransaction",
			label: "Largest Transaction",
			value: `₱${dashboardStats.largestTransaction.toLocaleString()}`,
			subtitle: "this period",
			icon: DollarSign,
			color: "orange",
			colorClasses: "text-orange-600 bg-orange-50 border-orange-100",
		},
		{
			key: "todayProfit",
			label: "Today's Profit",
			value: `₱${dashboardStats.todaysProfit.toLocaleString()}`,
			subtitle: "total profit today",
			icon: Calendar,
			color: "emerald",
			colorClasses: `text-green-600 bg-emerald-50 bg-emerald-100`,
		},
	];

	return (
		<section className="mt-6">
			{/* Section Header */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-slate-700">Quick Stats</h3>
				<span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
					Period Overview
				</span>
			</div>

			{/* Stats Grid - More compact and organized */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => {
					const IconComponent = stat.icon;
					return (
						<div
							key={stat.key}
							className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group"
						>
							<div className="flex items-start justify-between mb-3">
								<div
									className={`p-2 rounded-lg ${
										stat.colorClasses.split(" ")[1]
									} ${stat.colorClasses.split(" ")[2]}`}
								>
									<IconComponent
										className={`w-4 h-4 ${stat.colorClasses.split(" ")[0]}`}
									/>
								</div>
								<div
									className={`w-1.5 h-1.5 rounded-full ${stat.colorClasses
										.split(" ")[0]
										.replace("text-", "bg-")}`}
								></div>
							</div>

							<div className="space-y-1">
								<p className="text-xs text-slate-600 font-medium leading-tight">
									{stat.label}
								</p>
								<p className="text-lg font-bold text-slate-800">{stat.value}</p>
								<p
									className={`text-xs ${
										stat.key === "todayProfit"
											? dashboardStats.todaysProfit >= 0
												? "text-emerald-600"
												: "text-rose-600"
											: "text-slate-500"
									}`}
								>
									{stat.subtitle}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default Stats;
