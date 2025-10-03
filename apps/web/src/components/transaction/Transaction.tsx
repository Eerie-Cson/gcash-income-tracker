import React, { useState, useCallback, useEffect } from "react";
import {
	Search,
	Download,
	Edit3,
	Trash2,
	ArrowUpCircle,
	ArrowDownCircle,
	ChevronLeft,
	ChevronRight,
	Eye,
	AlertCircle,
	X,
} from "lucide-react";
import { useTransactionsApi } from "@/hooks/useTransactionsApi";
import { NotificationType, TransactionType } from "@/utils/types";
import AddTransactionModal from "./AddTransactionModal";
import Notification from "../../ui/Notification";
import { useNotification } from "@/hooks/useNotification";
import Link from "next/link";
import GreenButton from "@/ui/AddTransactionButton";
import { CustomerTransaction, CreatePayload } from "@/hooks/useTransactionsApi";

const TransactionsSection: React.FC = () => {
	const {
		transactions,
		pagination,
		loading,
		creating,
		createTransaction,
		refetch,
	} = useTransactionsApi();

	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);
	const { notification, showNotification, hideNotification } =
		useNotification();

	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [selectedTransaction, setSelectedTransaction] =
		useState<CustomerTransaction | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<
		string | null | undefined
	>(null);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			refetch({
				page: 1,
				limit: itemsPerPage,
				search: searchTerm,
				type: filterType,
			});
			setCurrentPage(1);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, filterType, refetch, itemsPerPage]);

	const handlePageChange = useCallback(
		(page: number) => {
			setCurrentPage(page);
			refetch({
				page,
				limit: itemsPerPage,
				search: searchTerm,
				type: filterType,
			});
		},
		[refetch, itemsPerPage, searchTerm, filterType]
	);

	const getTransactionIcon = useCallback((type: string) => {
		switch (type) {
			case TransactionType.CASH_IN:
				return <ArrowUpCircle className="w-4 h-4 text-green-600" />;
			case TransactionType.CASH_OUT:
				return <ArrowDownCircle className="w-4 h-4 text-blue-600" />;
			default:
				return <ArrowUpCircle className="w-4 h-4 text-gray-600" />;
		}
	}, []);

	const handleAddTransaction = useCallback(
		async (data: CreatePayload) => {
			try {
				await createTransaction(data);

				const title = "Transaction Created Successfully!";
				const message = `${data.transactionType} transaction for ${data.customerName} has been added successfully.`;

				showNotification(title, NotificationType.SUCCESS, message);

				closeModal();
				setCurrentPage(1);
			} catch (error) {
				console.error("Transaction creation failed:", error);
				const title = "Transaction Failed";
				const message =
					"There was an error creating the transaction. Please try again.";

				showNotification(title, NotificationType.ERROR, message);
			}
		},
		[createTransaction, closeModal, showNotification]
	);
	const handleDeleteTransaction = useCallback((id: string) => {
		if (!confirm(`Delete transaction ${id}? This cannot be undone.`)) return;
		alert(
			"Delete is UI-only for now. Implement server delete + refetch to remove permanently."
		);
		setShowDeleteConfirm(null);
	}, []);

	return (
		<div className="p-4 md:p-6">
			<Notification
				isOpen={notification.isOpen}
				onClose={hideNotification}
				type={notification.type}
				title={notification.title}
				message={notification.message}
				duration={5000}
				autoClose={true}
				showCloseButton={true}
			/>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">
							Transaction Management
						</h1>
						<p className="text-slate-600 text-sm lg:text-base">
							Track and manage all your cash-in and cash-out transactions
						</p>
					</div>

					{/* <button
						onClick={openModal}
						className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm whitespace-nowrap"
					>
						<Plus className="w-4 h-4" />
						Add Transaction
					</button> */}
					<GreenButton openModal={openModal} />
				</div>

				{/* Breadcrumb */}
				<nav className="flex items-center text-sm text-slate-500">
					<Link
						href="/dashboard"
						className="hover:text-slate-700 transition-colors cursor-pointer"
					>
						Home
					</Link>
					{/* <span className="hover:text-slate-700 transition-colors cursor-pointer">
						Home
					</span> */}
					<span className="mx-2 text-slate-400">/</span>
					<span className="font-medium text-emerald-600 cursor-default">
						Transactions
					</span>
				</nav>

				{/* Filters and Search */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
								<input
									type="text"
									placeholder="Search by customer name, transaction ID, reference..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Type Filter */}
						<select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
						>
							<option value="all">All Types</option>
							<option value={TransactionType.CASH_IN}>Cash In</option>
							<option value={TransactionType.CASH_OUT}>Cash Out</option>
						</select>

						{/* Export Button */}
						<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">
							<Download className="w-4 h-4" />
							Export
						</button>
					</div>

					<div className="mt-4 text-sm text-slate-600">
						Showing {(currentPage - 1) * itemsPerPage + 1}-
						{Math.min(currentPage * itemsPerPage, pagination.total)} of{" "}
						{pagination.total} transactions
					</div>
				</div>

				{/* Transactions Table */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[800px]">
							<thead className="bg-slate-50 border-b border-slate-200">
								<tr>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Transaction
									</th>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Customer
									</th>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Type
									</th>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Amount
									</th>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Date
									</th>
									<th className="text-left px-6 py-4 text-sm font-medium text-slate-700">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200">
								{transactions.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-slate-50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												{getTransactionIcon(transaction.transactionType)}
												<div>
													<div className="font-medium text-slate-900">
														{transaction.transactionCode || "Loading..."}
													</div>
													<div className="text-sm text-slate-500">
														{transaction.referenceNumber}
													</div>
												</div>
											</div>
										</td>

										<td className="px-6 py-4">
											<div>
												<div className="font-medium text-slate-900">
													{transaction.customerName}
												</div>
												<div className="text-sm text-slate-500">
													{transaction.customerPhone}
												</div>
											</div>
										</td>

										<td className="px-6 py-4">
											<span
												className={`inline-block rounded-full border text-sm font-medium text-center
													sm:text-xs sm:px-2 sm:py-0.5 w-20
													whitespace-nowrap overflow-hidden text-ellipsis
													${
														transaction.transactionType ===
														TransactionType.CASH_IN
															? "text-green-600 bg-teal-100 border-emerald-600"
															: "text-blue-600 bg-indigo-100 border-blue-400"
													}
												`}
											>
												{transaction.transactionType === TransactionType.CASH_IN
													? "Cash In"
													: "Cash Out"}
											</span>
										</td>

										<td className="px-6 py-4">
											<div>
												<div className="font-medium text-slate-900">
													₱{Number(transaction.amount).toLocaleString()}
												</div>
												<div className="text-sm text-emerald-600">
													+₱{transaction.profit ?? 0} profit
												</div>
											</div>
										</td>

										<td className="px-6 py-4">
											<div>
												<div className="text-sm text-slate-900">
													{transaction.transactionDate
														? new Date(
																transaction.transactionDate
														  ).toLocaleDateString()
														: "-"}
												</div>
												<div className="text-sm text-slate-500">
													{transaction.transactionDate
														? new Date(
																transaction.transactionDate
														  ).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
														  })
														: "-"}
												</div>
											</div>
										</td>

										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() => setSelectedTransaction(transaction)}
													className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
													title="View details"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
													title="Edit transaction"
												>
													<Edit3 className="w-4 h-4" />
												</button>
												<button
													onClick={() =>
														setShowDeleteConfirm(transaction.transactionCode)
													}
													className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
													title="Delete transaction"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}

								{transactions.length === 0 && (
									<tr>
										<td
											colSpan={6}
											className="px-6 py-8 text-center text-sm text-slate-500"
										>
											{loading
												? "Loading transactions..."
												: "No transactions found."}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="text-sm text-slate-600">
								Page {currentPage} of {pagination.totalPages}
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={!pagination.hasPrev}
									className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>

								{Array.from(
									{ length: Math.min(5, pagination.totalPages) },
									(_, i) => {
										let pageNum;
										if (pagination.totalPages <= 5) pageNum = i + 1;
										else if (currentPage <= 3) pageNum = i + 1;
										else if (currentPage >= pagination.totalPages - 2)
											pageNum = pagination.totalPages - 4 + i;
										else pageNum = currentPage - 2 + i;

										return (
											<button
												key={pageNum}
												onClick={() => handlePageChange(pageNum)}
												className={`px-3 py-1.5 rounded-lg text-sm ${
													currentPage === pageNum
														? "bg-emerald-600 text-white"
														: "border border-slate-200 hover:bg-white"
												}`}
											>
												{pageNum}
											</button>
										);
									}
								)}

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={!pagination.hasNext}
									className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Add Transaction Modal */}

				<AddTransactionModal
					isOpen={isOpen}
					onClose={closeModal}
					onSubmit={handleAddTransaction}
					isCreating={creating}
				/>

				{/* Transaction Details Modal */}
				{selectedTransaction && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl max-w-md w-full">
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-slate-900">
										Transaction Details
									</h2>
									<button
										onClick={() => setSelectedTransaction(null)}
										className="p-2 hover:bg-slate-100 rounded-lg"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">
											Transaction ID
										</span>
										<span className="font-medium">
											{selectedTransaction.id}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Type</span>
										<span className="font-medium">
											{selectedTransaction.transactionType ===
											TransactionType.CASH_IN
												? "Cash In"
												: "Cash Out"}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Customer</span>
										<div className="text-right">
											<div className="font-medium">
												{selectedTransaction.customerName}
											</div>
											<div className="text-sm text-slate-500">
												{selectedTransaction.customerPhone}
											</div>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Amount</span>
										<span className="font-medium">
											₱{Number(selectedTransaction.amount).toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Profit</span>
										<span className="font-medium text-emerald-600">
											₱{(selectedTransaction.profit ?? 0).toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Reference</span>
										<span className="font-medium font-mono text-sm">
											{selectedTransaction.referenceNumber}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Date & Time</span>
										<div className="text-right">
											<div className="font-medium">
												{selectedTransaction.transactionDate
													? new Date(
															selectedTransaction.transactionDate
													  ).toLocaleDateString()
													: "-"}
											</div>
											<div className="text-sm text-slate-500">
												{selectedTransaction.transactionDate
													? new Date(
															selectedTransaction.transactionDate
													  ).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
													  })
													: "-"}
											</div>
										</div>
									</div>

									{selectedTransaction.description && (
										<div className="pt-4 border-t border-slate-200">
											<span className="text-sm text-slate-600">Notes</span>
											<p className="mt-1 text-sm text-slate-900">
												{selectedTransaction.description}
											</p>
										</div>
									)}
								</div>

								<button
									onClick={() => setSelectedTransaction(null)}
									className="w-full mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{showDeleteConfirm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl max-w-sm w-full">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
										<AlertCircle className="w-5 h-5 text-red-600" />
									</div>
									<h2 className="text-lg font-bold text-slate-900">
										Delete Transaction
									</h2>
								</div>

								<p className="text-slate-600 mb-6">
									Are you sure you want to delete transaction{" "}
									{showDeleteConfirm}? This action cannot be undone.
								</p>

								<div className="flex gap-3">
									<button
										onClick={() => setShowDeleteConfirm(null)}
										className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										onClick={() => handleDeleteTransaction(showDeleteConfirm)}
										className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionsSection;
