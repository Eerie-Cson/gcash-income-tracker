import React, { useState, useMemo } from "react";
import {
	Search,
	Filter,
	Download,
	ArrowUpRight,
	ArrowDownLeft,
	Calendar,
	ChevronDown,
	MoreHorizontal,
	TrendingUp,
	TrendingDown,
	Wallet,
	CreditCard,
} from "lucide-react";

// Sample transaction data matching the theme
const sampleTransactions = [
	{
		id: "REF-B9C1D3",
		type: "cash_in",
		amount: 3600,
		profit: 0,
		description: "Cash withdrawal",
		timestamp: "2025-09-17T17:25:00Z",
		wallet: "cash",
		status: "completed",
	},
	{
		id: "REF-Q2W8E5",
		type: "cash_out",
		amount: 6720,
		profit: 0,
		description: "Cash deposit",
		timestamp: "2025-09-17T16:10:00Z",
		wallet: "cash",
		status: "completed",
	},
	{
		id: "REF-K5J3L6",
		type: "cash_out",
		amount: 4950,
		profit: 0,
		description: "Cash withdrawal",
		timestamp: "2025-09-17T15:30:00Z",
		wallet: "cash",
		status: "completed",
	},
	{
		id: "REF-R4T2M7",
		type: "cash_in",
		amount: 8150,
		profit: 0,
		description: "Cash deposit",
		timestamp: "2025-09-17T14:25:00Z",
		wallet: "cash",
		status: "completed",
	},
	{
		id: "REF-M4Q7D2",
		type: "cash_out",
		amount: 3650,
		profit: 0,
		description: "Cash withdrawal",
		timestamp: "2025-09-16T18:41:00Z",
		wallet: "cash",
		status: "completed",
	},
	{
		id: "REF-P9L3K8",
		type: "gcash_in",
		amount: 5200,
		profit: 150,
		description: "GCash transfer",
		timestamp: "2025-09-16T12:15:00Z",
		wallet: "gcash",
		status: "completed",
	},
	{
		id: "REF-N7M2X4",
		type: "gcash_out",
		amount: 2800,
		profit: 75,
		description: "GCash withdrawal",
		timestamp: "2025-09-15T14:20:00Z",
		wallet: "gcash",
		status: "pending",
	},
];

export default function TransactionsSection() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [dateFilter, setDateFilter] = useState("all");

	// Filter transactions based on search and filters
	const filteredTransactions = useMemo(() => {
		return sampleTransactions.filter((transaction) => {
			const matchesSearch =
				transaction.description
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesType =
				filterType === "all" ||
				(filterType === "cash_in" && transaction.type === "cash_in") ||
				(filterType === "cash_out" && transaction.type === "cash_out") ||
				(filterType === "gcash_in" && transaction.type === "gcash_in") ||
				(filterType === "gcash_out" && transaction.type === "gcash_out");

			return matchesSearch && matchesType;
		});
	}, [searchTerm, filterType]);

	const formatTime = (timestamp: any) => {
		const date = new Date(timestamp);
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		const transactionDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);

		if (transactionDate.getTime() === today.getTime()) {
			return `Today at ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})}`;
		} else if (transactionDate.getTime() === yesterday.getTime()) {
			return `Yesterday at ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})}`;
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		}
	};

	const getTransactionIcon = (type: any) => {
		switch (type) {
			case "cash_in":
			case "gcash_in":
				return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
			case "cash_out":
			case "gcash_out":
				return <ArrowUpRight className="w-4 h-4 text-red-500" />;
			default:
				return <Wallet className="w-4 h-4 text-slate-400" />;
		}
	};

	const getTransactionBg = (type: any) => {
		switch (type) {
			case "cash_in":
			case "gcash_in":
				return "bg-emerald-50 border-emerald-100";
			case "cash_out":
			case "gcash_out":
				return "bg-red-50 border-red-100";
			default:
				return "bg-slate-50 border-slate-100";
		}
	};

	const getWalletIcon = (wallet: any) => {
		return wallet === "gcash" ? (
			<CreditCard className="w-3 h-3 text-emerald-600" />
		) : (
			<Wallet className="w-3 h-3 text-blue-600" />
		);
	};

	return (
		<div className="bg-gradient-to-bl from-teal-100 via-white to-teal-100 min-h-screen p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-slate-900 mb-2">
								Transactions
							</h1>
							<p className="text-slate-600">
								Manage and track your cash and GCash transactions
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
								<Download className="w-4 h-4" />
								Export
							</button>
							<button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
								<ArrowDownLeft className="w-4 h-4" />
								Add Transaction
							</button>
						</div>
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="text"
								placeholder="Search transactions..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
							/>
						</div>
						<div className="flex gap-3">
							<select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="px-4 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							>
								<option value="all">All Types</option>
								<option value="cash_in">Cash In</option>
								<option value="cash_out">Cash Out</option>
								<option value="gcash_in">GCash In</option>
								<option value="gcash_out">GCash Out</option>
							</select>
							<button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
								<Calendar className="w-4 h-4" />
								Date
								<ChevronDown className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Summary Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<div className="bg-white rounded-xl border border-slate-200 p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-slate-700">
									Total In
								</span>
							</div>
							<div className="text-2xl font-bold text-slate-900">₱17,950</div>
							<div className="text-sm text-slate-500 mt-1">4 transactions</div>
						</div>

						<div className="bg-white rounded-xl border border-slate-200 p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
									<TrendingDown className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-slate-700">
									Total Out
								</span>
							</div>
							<div className="text-2xl font-bold text-slate-900">₱18,120</div>
							<div className="text-sm text-slate-500 mt-1">3 transactions</div>
						</div>

						<div className="bg-white rounded-xl border border-slate-200 p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<Wallet className="w-5 h-5 text-blue-600" />
								</div>
								<span className="text-sm font-medium text-slate-700">
									Net Flow
								</span>
							</div>
							<div className="text-2xl font-bold text-red-600">-₱170</div>
							<div className="text-sm text-slate-500 mt-1">this period</div>
						</div>

						<div className="bg-white rounded-xl border border-slate-200 p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-slate-700">
									Total Profit
								</span>
							</div>
							<div className="text-2xl font-bold text-emerald-600">₱225</div>
							<div className="text-sm text-slate-500 mt-1">+12.5%</div>
						</div>
					</div>
				</div>

				{/* Transactions List */}
				<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-200">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-slate-900">
								All Transactions
							</h2>
							<span className="text-sm text-slate-500">
								{filteredTransactions.length} transactions
							</span>
						</div>
					</div>

					<div className="divide-y divide-slate-100">
						{filteredTransactions.map((transaction) => (
							<div
								key={transaction.id}
								className="px-6 py-4 hover:bg-slate-50 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div
											className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getTransactionBg(
												transaction.type
											)}`}
										>
											{getTransactionIcon(transaction.type)}
										</div>

										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-medium text-slate-900 capitalize">
													{transaction.type.replace("_", " ")}
												</h3>
												<div className="flex items-center gap-1 text-xs text-slate-500">
													{getWalletIcon(transaction.wallet)}
													<span className="capitalize">
														{transaction.wallet}
													</span>
												</div>
												{transaction.status === "pending" && (
													<span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
														Pending
													</span>
												)}
											</div>
											<div className="flex items-center gap-4 text-sm text-slate-500">
												<span>Ref. #{transaction.id}</span>
												<span>{transaction.description}</span>
												<span>{formatTime(transaction.timestamp)}</span>
											</div>
										</div>
									</div>

									<div className="text-right">
										<div className="text-lg font-semibold text-slate-900 mb-1">
											₱{transaction.amount.toLocaleString()}
										</div>
										{transaction.profit > 0 && (
											<div className="text-sm text-emerald-600 font-medium">
												+₱{transaction.profit}
											</div>
										)}
									</div>

									<button className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
										<MoreHorizontal className="w-4 h-4 text-slate-400" />
									</button>
								</div>
							</div>
						))}
					</div>

					{filteredTransactions.length === 0 && (
						<div className="px-6 py-12 text-center">
							<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Search className="w-6 h-6 text-slate-400" />
							</div>
							<h3 className="text-lg font-medium text-slate-900 mb-2">
								No transactions found
							</h3>
							<p className="text-slate-500">
								Try adjusting your search or filter criteria
							</p>
						</div>
					)}

					{/* Pagination */}
					<div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
						<div className="flex items-center justify-between">
							<div className="text-sm text-slate-500">
								Showing {filteredTransactions.length} of{" "}
								{sampleTransactions.length} transactions
							</div>
							<div className="flex items-center gap-2">
								<button className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-colors">
									Previous
								</button>
								<button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
									1
								</button>
								<button className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-colors">
									2
								</button>
								<button className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-white transition-colors">
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
