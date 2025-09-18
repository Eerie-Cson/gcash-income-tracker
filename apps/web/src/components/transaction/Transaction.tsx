import React, { useState, useMemo } from "react";
import {
	Plus,
	Search,
	Filter,
	Download,
	Edit3,
	Trash2,
	ArrowUpCircle,
	ArrowDownCircle,
	Calendar,
	Clock,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
	Eye,
	AlertCircle,
	CheckCircle,
	X,
} from "lucide-react";

// Mock data for transactions
const generateMockTransactions = () => {
	const types = [
		"cash-in",
		"cash-out-profit-included",
		"cash-out-profit-separate",
	];
	const typeLabels = {
		"cash-in": "Cash In",
		"cash-out-profit-included": "Cash Out (Profit Included)",
		"cash-out-profit-separate": "Cash Out (Profit Separate)",
	};
	const statuses = ["completed", "pending", "failed"];

	return Array.from({ length: 10145 }, (_, i) => ({
		id: `TXN-${String(i + 1).padStart(4, "0")}`,
		type: types[Math.floor(Math.random() * types.length)],
		typeLabel: typeLabels[types[Math.floor(Math.random() * types.length)]],
		amount: Math.floor(Math.random() * 5000) + 100,
		profit: Math.floor(Math.random() * 50) + 5,
		customerName: `Customer ${i + 1}`,
		customerPhone: `09${Math.floor(Math.random() * 900000000) + 100000000}`,
		status: statuses[Math.floor(Math.random() * statuses.length)],
		reference: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
		createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
		notes: Math.random() > 0.7 ? `Note for transaction ${i + 1}` : "",
	}));
};

const TransactionsSection = () => {
	const [showAddForm, setShowAddForm] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

	// Form states
	const [formData, setFormData] = useState({
		type: "cash-in",
		amount: "",
		customerName: "",
		customerPhone: "",
		notes: "",
	});

	const allTransactions = useMemo(() => generateMockTransactions(), []);

	// Filter and search logic
	const filteredTransactions = useMemo(() => {
		return allTransactions.filter((transaction) => {
			const matchesSearch =
				transaction.customerName
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transaction.reference
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				transaction.customerPhone.includes(searchTerm);

			const matchesType =
				filterType === "all" || transaction.type === filterType;
			const matchesStatus =
				filterStatus === "all" || transaction.status === filterStatus;

			return matchesSearch && matchesType && matchesStatus;
		});
	}, [allTransactions, searchTerm, filterType, filterStatus]);

	// Pagination logic
	const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedTransactions = filteredTransactions.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const handleAddTransaction = () => {
		if (!formData.amount || !formData.customerName || !formData.customerPhone) {
			alert("Please fill in all required fields");
			return;
		}
		console.log("Adding transaction:", formData);
		setShowAddForm(false);
		setFormData({
			type: "cash-in",
			amount: "",
			customerName: "",
			customerPhone: "",
			notes: "",
		});
	};

	const getTransactionIcon = (type) => {
		switch (type) {
			case "cash-in":
				return <ArrowUpCircle className="w-4 h-4 text-green-600" />;
			case "cash-out-profit-included":
			case "cash-out-profit-separate":
				return <ArrowDownCircle className="w-4 h-4 text-blue-600" />;
			default:
				return <ArrowUpCircle className="w-4 h-4 text-gray-600" />;
		}
	};

	const getStatusBadge = (status) => {
		const styles = {
			completed: "bg-green-100 text-green-800 border-green-200",
			pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
			failed: "bg-red-100 text-red-800 border-red-200",
		};

		const icons = {
			completed: <CheckCircle className="w-3 h-3" />,
			pending: <Clock className="w-3 h-3" />,
			failed: <AlertCircle className="w-3 h-3" />,
		};

		return (
			<span
				className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
			>
				{icons[status]}
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	return (
		<div className="p-4 md:p-6">
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

					<button
						onClick={() => setShowAddForm(true)}
						className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm whitespace-nowrap"
					>
						<Plus className="w-4 h-4" />
						Add Transaction
					</button>
				</div>

				{/* Breadcrumb */}
				<nav className="flex items-center text-sm text-slate-500">
					<span className="hover:text-slate-700 transition-colors cursor-pointer">
						Home
					</span>
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
									onChange={(e) => {
										setSearchTerm(e.target.value);
										setCurrentPage(1);
									}}
									className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Type Filter */}
						<select
							value={filterType}
							onChange={(e) => {
								setFilterType(e.target.value);
								setCurrentPage(1);
							}}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
						>
							<option value="all">All Types</option>
							<option value="cash-in">Cash In</option>
							<option value="cash-out-profit-included">
								Cash Out (Profit Included)
							</option>
							<option value="cash-out-profit-separate">
								Cash Out (Profit Separate)
							</option>
						</select>

						{/* Status Filter */}
						<select
							value={filterStatus}
							onChange={(e) => {
								setFilterStatus(e.target.value);
								setCurrentPage(1);
							}}
							className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
						>
							<option value="all">All Status</option>
							<option value="completed">Completed</option>
							<option value="pending">Pending</option>
							<option value="failed">Failed</option>
						</select>

						{/* Export Button */}
						<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">
							<Download className="w-4 h-4" />
							Export
						</button>
					</div>

					{/* Results Summary */}
					<div className="mt-4 text-sm text-slate-600">
						Showing {startIndex + 1}-
						{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}{" "}
						of {filteredTransactions.length} transactions
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
										Status
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
								{paginatedTransactions.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-slate-50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												{getTransactionIcon(transaction.type)}
												<div>
													<div className="font-medium text-slate-900">
														{transaction.id}
													</div>
													<div className="text-sm text-slate-500">
														{transaction.reference}
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
											<span className="text-sm text-slate-700">
												{transaction.typeLabel}
											</span>
										</td>
										<td className="px-6 py-4">
											<div>
												<div className="font-medium text-slate-900">
													₱{transaction.amount.toLocaleString()}
												</div>
												<div className="text-sm text-emerald-600">
													+₱{transaction.profit} profit
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											{getStatusBadge(transaction.status)}
										</td>
										<td className="px-6 py-4">
											<div>
												<div className="text-sm text-slate-900">
													{transaction.createdAt.toLocaleDateString()}
												</div>
												<div className="text-sm text-slate-500">
													{transaction.createdAt.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
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
													onClick={() => setShowDeleteConfirm(transaction.id)}
													className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
													title="Delete transaction"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="text-sm text-slate-600">
								Page {currentPage} of {totalPages}
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() =>
										setCurrentPage((prev) => Math.max(prev - 1, 1))
									}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronLeft className="w-4 h-4" />
								</button>

								{/* Page numbers */}
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNum;
									if (totalPages <= 5) {
										pageNum = i + 1;
									} else if (currentPage <= 3) {
										pageNum = i + 1;
									} else if (currentPage >= totalPages - 2) {
										pageNum = totalPages - 4 + i;
									} else {
										pageNum = currentPage - 2 + i;
									}

									return (
										<button
											key={pageNum}
											onClick={() => setCurrentPage(pageNum)}
											className={`px-3 py-1.5 rounded-lg text-sm ${
												currentPage === pageNum
													? "bg-emerald-600 text-white"
													: "border border-slate-200 hover:bg-white"
											}`}
										>
											{pageNum}
										</button>
									);
								})}

								<button
									onClick={() =>
										setCurrentPage((prev) => Math.min(prev + 1, totalPages))
									}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Add Transaction Modal */}
				{showAddForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-slate-900">
										Add New Transaction
									</h2>
									<button
										onClick={() => setShowAddForm(false)}
										className="p-2 hover:bg-slate-100 rounded-lg"
									>
										<X className="w-5 h-5" />
									</button>
								</div>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-slate-700 mb-2">
											Transaction Type
										</label>
										<select
											value={formData.type}
											onChange={(e) =>
												setFormData({ ...formData, type: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
											required
										>
											<option value="cash-in">Cash In</option>
											<option value="cash-out-profit-included">
												Cash Out (Profit Included)
											</option>
											<option value="cash-out-profit-separate">
												Cash Out (Profit Separate)
											</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-700 mb-2">
											Amount (₱)
										</label>
										<input
											type="number"
											value={formData.amount}
											onChange={(e) =>
												setFormData({ ...formData, amount: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
											placeholder="Enter amount"
											min="1"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-700 mb-2">
											Customer Name
										</label>
										<input
											type="text"
											value={formData.customerName}
											onChange={(e) =>
												setFormData({
													...formData,
													customerName: e.target.value,
												})
											}
											className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
											placeholder="Enter customer name"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-700 mb-2">
											Customer Phone
										</label>
										<input
											type="tel"
											value={formData.customerPhone}
											onChange={(e) =>
												setFormData({
													...formData,
													customerPhone: e.target.value,
												})
											}
											className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
											placeholder="09XXXXXXXXX"
											pattern="[0-9]{11}"
											required
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-700 mb-2">
											Notes (Optional)
										</label>
										<textarea
											value={formData.notes}
											onChange={(e) =>
												setFormData({ ...formData, notes: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
											placeholder="Add any additional notes..."
											rows="3"
										/>
									</div>

									<div className="flex gap-3 pt-4">
										<button
											type="button"
											onClick={() => setShowAddForm(false)}
											className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={handleAddTransaction}
											className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
										>
											Add Transaction
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

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
											{selectedTransaction.typeLabel}
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
											₱{selectedTransaction.amount.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Profit</span>
										<span className="font-medium text-emerald-600">
											₱{selectedTransaction.profit.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Status</span>
										{getStatusBadge(selectedTransaction.status)}
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Reference</span>
										<span className="font-medium font-mono text-sm">
											{selectedTransaction.reference}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Date & Time</span>
										<div className="text-right">
											<div className="font-medium">
												{selectedTransaction.createdAt.toLocaleDateString()}
											</div>
											<div className="text-sm text-slate-500">
												{selectedTransaction.createdAt.toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</div>
									</div>

									{selectedTransaction.notes && (
										<div className="pt-4 border-t border-slate-200">
											<span className="text-sm text-slate-600">Notes</span>
											<p className="mt-1 text-sm text-slate-900">
												{selectedTransaction.notes}
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
										onClick={() => {
											console.log("Deleting transaction:", showDeleteConfirm);
											setShowDeleteConfirm(null);
										}}
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
