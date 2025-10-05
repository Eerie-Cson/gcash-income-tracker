import React, { Dispatch, SetStateAction } from "react";
import TransactionsList from "./TransactionsList";
import { ArrowRight, Filter, Search } from "lucide-react";
import { Transaction, NavItemId, NavigationType } from "@/utils/types";
import { useRouter } from "next/navigation";

interface TransactionsTableProps {
	transactions: Transaction[];
	setActive: Dispatch<SetStateAction<NavItemId>>;
}
const TransactionsTable = ({
	transactions,
	setActive,
}: TransactionsTableProps) => {
	const router = useRouter();
	const recentTransactions = transactions.slice(0, 5);

	const todayTransactions = transactions.filter((t: Transaction) => {
		const today = new Date().toDateString();
		return new Date(t.transactionDate).toDateString() === today;
	}).length;

	const totalToday = transactions
		.filter((t: Transaction) => {
			const today = new Date().toDateString();
			return new Date(t.transactionDate).toDateString() === today;
		})
		.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

	return (
		<section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
			<div className="p-6 pb-4 border-b border-slate-50">
				<div className="flex items-center justify-between mb-3">
					<div>
						<h2 className="text-xl text-emerald-600 font-bold">
							Recent Transactions
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							Latest {Math.min(transactions.length, 5)} of {transactions.length}{" "}
							transactions
						</p>
					</div>

					{/* Quick Actions */}
					<div className="flex items-center gap-2">
						<button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
							<Filter className="w-4 h-4 text-slate-600" />
						</button>
						<button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
							<Search className="w-4 h-4 text-slate-600" />
						</button>
					</div>
				</div>

				{/* Today's Summary */}
				{todayTransactions > 0 && (
					<div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
						<div className="text-sm">
							<span className="font-semibold text-slate-700">
								{todayTransactions}
							</span>
							<span className="text-slate-600"> transactions today</span>
						</div>
						<div className="text-sm">
							<span className="font-semibold text-slate-700">
								₱{totalToday.toLocaleString()}
							</span>
							<span className="text-slate-600"> total amount</span>
						</div>
					</div>
				)}
			</div>

			{/* Transactions List */}
			<div className="p-6 pt-4">
				{recentTransactions.length > 0 ? (
					<TransactionsList transactions={recentTransactions} />
				) : (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<ArrowRight className="w-8 h-8 text-slate-400" />
						</div>
						<p className="text-slate-600 font-medium">No transactions yet</p>
						<p className="text-slate-500 text-sm mt-1">
							Add your first transaction to get started
						</p>
					</div>
				)}
			</div>

			{/* Enhanced Footer */}
			{recentTransactions.length > 0 && (
				<div className="px-6 pb-6 flex items-center justify-between border-t border-slate-50 pt-4">
					<div className="text-xs text-slate-500">
						Showing latest {recentTransactions.length} transactions
					</div>
					<button
						onClick={() => {
							setActive(NavigationType.Transactions);
							router.push("/transactions/");
						}}
						className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 text-sm font-medium hover:border-slate-300 group"
					>
						<span>View all transactions</span>
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
					</button>
				</div>
			)}
		</section>
	);
};

export default TransactionsTable;
