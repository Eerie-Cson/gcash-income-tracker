import React from "react";
import {
	Bell,
	Plus,
	Download,
	Search,
	Filter,
	MoreVertical,
	Clock,
} from "lucide-react";

const DashboardHeader = ({
	userName = "John Doe",
	notifications = 0,
	onAddTransaction,
	onExport,
	onNotificationClick,
	accentClass = "text-emerald-600",
}: any) => {
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const currentTime = currentDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const getGreeting = () => {
		const hour = currentDate.getHours();
		if (hour < 12) return "morning";
		if (hour < 18) return "afternoon";
		return "evening";
	};

	const firstName = userName.split(" ")[0];

	return (
		<header className="mb-8">
			{/* Top Header Bar */}
			<div className="flex items-start justify-between mb-6">
				{/* Left side - Greeting & Date */}
				<div className="flex flex-col">
					<div className="flex items-center gap-3 mb-1">
						<h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
							Good {getGreeting()}, {firstName}!
						</h1>
						<div className="hidden sm:flex items-center gap-1 text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
							<Clock className="w-3 h-3" />
							<span>{currentTime}</span>
						</div>
					</div>
					<p className="text-slate-600 text-sm lg:text-base">{formattedDate}</p>
				</div>

				{/* Right side - Actions & Notifications */}
				<div className="flex items-center gap-3">
					{/* Search - Hidden on mobile */}
					<div className="hidden lg:flex items-center bg-white rounded-lg border border-slate-200 px-3 py-2 min-w-[220px] shadow-sm">
						<Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
						<input
							type="text"
							placeholder="Search transactions..."
							className="flex-1 outline-none text-sm placeholder:text-slate-400"
						/>
					</div>

					{/* Filter Button - Hidden on small screens */}
					<button
						className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
						aria-label="Filter transactions"
					>
						<Filter className="w-4 h-4 text-slate-600" />
						<span className="text-sm font-medium text-slate-700">Filter</span>
					</button>

					{/* Export Button - Hidden on small screens */}
					<button
						onClick={onExport}
						className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
						aria-label="Export data"
					>
						<Download className="w-4 h-4 text-slate-600" />
						<span className="text-sm font-medium text-slate-700">Export</span>
					</button>

					{/* Add Transaction Button - Primary CTA */}
					<button
						onClick={onAddTransaction}
						className={`flex items-center gap-2 px-4 py-2 ${accentClass
							.replace("text-", "bg-")
							.replace(
								"-600",
								"-500"
							)} text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm`}
						aria-label="Add new transaction"
					>
						<Plus className="w-4 h-4" />
						<span className="hidden sm:inline">Add Transaction</span>
						<span className="sm:hidden">Add</span>
					</button>

					{/* Notifications */}
					<button
						onClick={onNotificationClick}
						className="relative p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
						aria-label={`Notifications ${
							notifications > 0 ? `(${notifications} unread)` : ""
						}`}
					>
						<Bell className="w-5 h-5 text-slate-600" />
						{notifications > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium min-w-[20px]">
								{notifications > 99 ? "99+" : notifications}
							</span>
						)}
					</button>

					{/* More Options - Mobile menu */}
					<button
						className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
						aria-label="More options"
					>
						<MoreVertical className="w-5 h-5 text-slate-600" />
					</button>
				</div>
			</div>

			{/* Breadcrumb Navigation */}
			<nav
				className="flex items-center text-sm text-slate-500 mb-4"
				aria-label="Breadcrumb navigation"
			>
				<span className="hover:text-slate-700 transition-colors cursor-pointer">
					Home
				</span>
				<span className="mx-2 text-slate-400">/</span>
				<span className={`font-medium ${accentClass} cursor-default`}>
					Dashboard
				</span>
			</nav>
		</header>
	);
};

export default DashboardHeader;
