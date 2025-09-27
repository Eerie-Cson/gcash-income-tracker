import React, { useState, useEffect } from "react";
import {
	X,
	DollarSign,
	User,
	Phone,
	Hash,
	FileText,
	ArrowUpCircle,
	ArrowDownCircle,
	AlertCircle,
	Loader2,
	CreditCard,
	Shield,
	Wallet,
	AlertTriangle,
	Calendar,
} from "lucide-react";
import { TransactionType } from "@/utils/types";
import { useWalletBalances } from "@/hooks/useWalletBalance";

interface FormData {
	type: typeof TransactionType.CASH_IN | typeof TransactionType.CASH_OUT;
	amount: string;
	customerName: string;
	customerPhone: string;
	reference: string;
	notes: string;
	transactionDate: string;
}

interface ValidationErrors {
	amount?: string;
	customerName?: string;
	customerPhone?: string;
	reference?: string;
	transactionDate?: string;
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 2,
	}).format(amount);
};

const getCurrentDate = () => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

const AddTransactionModal = ({
	isOpen = true,
	onClose = () => {},
	onSubmit = async (data: {
		transactionType: TransactionType;
		amount: number;
		customerName: string;
		customerPhone: string;
		referenceNumber: string;
		notes: string;
		transactionDate: string;
	}) => {},
	isCreating = false,
}) => {
	const { balances } = useWalletBalances();
	const [formData, setFormData] = useState<FormData>({
		type: TransactionType.CASH_IN,
		amount: "",
		customerName: "",
		customerPhone: "",
		reference: "",
		notes: "",
		transactionDate: "",
	});

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setFormData({
				type: TransactionType.CASH_IN,
				amount: "",
				customerName: "",
				customerPhone: "",
				reference: "",
				notes: "",
				transactionDate: "",
			});
			setErrors({});
		}
	}, [isOpen]);

	const validateForm = (): ValidationErrors => {
		const newErrors: ValidationErrors = {};

		const amount = Number(formData.amount);
		if (!formData.amount.trim()) {
			newErrors.amount = "Amount is required";
		} else if (isNaN(amount) || amount <= 0) {
			newErrors.amount = "Amount must be a positive number";
		} else if (amount > 1000000) {
			newErrors.amount = "Amount cannot exceed ₱1,000,000";
		}

		if (
			formData.customerName.trim() &&
			formData.customerName.trim().length < 2
		) {
			newErrors.customerName = "Customer name must be at least 2 characters";
		}

		const phoneRegex = /^(09|\+639)\d{9}$/;
		if (!formData.customerPhone.trim()) {
			newErrors.customerPhone = "Phone number is required";
		} else if (!phoneRegex.test(formData.customerPhone.replace(/\s+/g, ""))) {
			newErrors.customerPhone = "Please enter a valid Philippine mobile number";
		}

		if (!formData.reference.trim()) {
			newErrors.reference = "Reference number is required";
		} else if (formData.reference.trim().length < 3) {
			newErrors.reference = "Reference must be at least 3 characters";
		}

		if (!formData.transactionDate) {
			newErrors.transactionDate = "Transaction date and time are required";
		} else {
			const selectedDate = new Date(formData.transactionDate);
			const now = new Date();

			if (selectedDate > now) {
				newErrors.transactionDate = "Transaction date cannot be in the future";
			}
		}

		return newErrors;
	};

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		if (errors[field as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit({
				transactionType: formData.type,
				amount: Number(formData.amount),
				customerName: formData.customerName.trim(),
				customerPhone: formData.customerPhone.replace(/\s+/g, ""),
				referenceNumber: formData.reference.trim(),
				notes: formData.notes.trim(),
				transactionDate: formData.transactionDate,
			});

			setTimeout(() => {
				onClose();
			}, 2500);
		} catch (error) {
			console.error("Transaction creation failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Modal */}
			<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
				<div
					className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200"
					style={{ maxHeight: "calc(100vh - 2rem)" }}
				>
					{/* Header - Fixed */}
					<div
						className={`flex-shrink-0 relative bg-gradient-to-r px-6 py-5 text-white rounded-t-2xl
						${
							formData.type === TransactionType.CASH_IN
								? " from-teal-600 to-cyan-600"
								: "from-blue-600 to-cyan-600"
						}`}
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
								{formData.type === TransactionType.CASH_IN ? (
									<ArrowUpCircle className="w-5 h-5 " />
								) : (
									<ArrowDownCircle className="w-5 h-5" />
								)}
							</div>
							<div>
								<h2 className="text-xl font-bold">Add New Transaction</h2>
								<p className="text-emerald-100 text-sm">
									Create a new{" "}
									{formData.type === TransactionType.CASH_IN
										? "cash-in"
										: "cash-out"}{" "}
									transaction
								</p>
							</div>
						</div>

						<button
							onClick={onClose}
							className="cursor-pointer absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
							disabled={isSubmitting}
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Balance Section - Fixed */}
					<div className="flex-shrink-0 relative px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 border-b border-gray-100/50 backdrop-blur-sm">
						<div className="flex items-center gap-1 mb-3">
							<Shield className="w-4 h-4 text-gray-600" />
							<span className="text-sm font-semibold text-gray-700">
								Current Balances
							</span>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-blue-200/50">
								<div className="flex items-center gap-2 mb-1">
									<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
										<CreditCard className="w-4 h-4 text-blue-600" />
									</div>
									<span className="text-xs font-medium text-gray-600">
										GCash
									</span>
								</div>
								<p className="text-lg font-bold text-blue-700">
									{formatCurrency(balances.gcash)}
								</p>
							</div>
							<div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-green-200/50">
								<div className="flex items-center gap-2 mb-1">
									<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
										<Wallet className="w-4 h-4 text-green-600" />
									</div>
									<span className="text-xs font-medium text-gray-600">
										Cash
									</span>
								</div>
								<p className="text-lg font-bold text-green-700">
									{formatCurrency(balances.cash)}
								</p>
							</div>
						</div>
					</div>

					{/* Scrollable Form Content */}
					<div className="flex-1 overflow-y-auto min-h-0">
						<div className="p-6 space-y-5">
							{/* Transaction Type */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-3">
									Transaction Type
								</label>
								<div className="grid grid-cols-2 gap-3">
									{[
										{
											value: TransactionType.CASH_IN,
											label: "Cash In",
											icon: ArrowUpCircle,
											color: "emerald",
										},
										{
											value: TransactionType.CASH_OUT,
											label: "Cash Out",
											icon: ArrowDownCircle,
											color: "blue",
										},
									].map(({ value, label, icon: Icon, color }) => (
										<button
											key={value}
											type="button"
											onClick={() => handleInputChange("type", value)}
											className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
												formData.type === value
													? `border-${color}-500 bg-${color}-50 text-${color}-700`
													: "border-gray-200 hover:border-gray-300 text-gray-600"
											}`}
										>
											<Icon
												className={`w-6 h-6 mx-auto mb-2 ${
													formData.type === value
														? `text-${color}-600`
														: "text-gray-400"
												}`}
											/>
											<span className="font-medium text-sm">{label}</span>
										</button>
									))}
								</div>
							</div>

							{/* Transaction Date & Time - Now required */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Transaction Date & Time *
								</label>
								<div className="grid grid-cols-2 gap-3">
									<div className="relative">
										<Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
										<input
											type="date"
											value={formData.transactionDate.split("T")[0] || ""}
											onChange={(e) => {
												const currentTime =
													formData.transactionDate.split("T")[1] || "00:00";
												const newDate = e.target.value;
												if (newDate) {
													handleInputChange(
														"transactionDate",
														`${newDate}T${currentTime}`
													);
												} else {
													handleInputChange("transactionDate", "");
												}
											}}
											className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
												errors.transactionDate
													? "border-red-300 bg-red-50"
													: "border-gray-300"
											}`}
											max={getCurrentDate()}
											required
										/>
									</div>
									<div className="relative">
										<div className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-5 h-5"
											>
												<circle cx="12" cy="12" r="10" />
												<polyline points="12,6 12,12 16,14" />
											</svg>
										</div>
										<input
											type="time"
											value={formData.transactionDate.split("T")[1] || ""}
											onChange={(e) => {
												const currentDate =
													formData.transactionDate.split("T")[0] ||
													getCurrentDate();
												const newTime = e.target.value;
												if (newTime) {
													handleInputChange(
														"transactionDate",
														`${currentDate}T${newTime}`
													);
												} else if (currentDate) {
													handleInputChange(
														"transactionDate",
														`${currentDate}T00:00`
													);
												}
											}}
											className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
												errors.transactionDate
													? "border-red-300 bg-red-50"
													: "border-gray-300"
											}`}
											required
										/>
									</div>
								</div>
								{errors.transactionDate && (
									<div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
										<AlertCircle className="w-3 h-3" />
										{errors.transactionDate}
									</div>
								)}
								{!formData.transactionDate && (
									<div className="flex items-center gap-1 mt-1 text-amber-600 text-xs">
										<AlertTriangle className="w-3 h-3" />
										Please select both date and time for this transaction
									</div>
								)}
							</div>

							{/* Amount */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Amount
								</label>
								<div className="relative">
									<DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="number"
										value={formData.amount}
										onChange={(e) =>
											handleInputChange("amount", e.target.value)
										}
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
											errors.amount
												? "border-red-300 bg-red-50"
												: "border-gray-300"
										}`}
										placeholder="0.00"
										step="0.01"
										min="0.01"
										max="1000000"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
										PHP
									</span>
								</div>
								{errors.amount && (
									<div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
										<AlertCircle className="w-3 h-3" />
										{errors.amount}
									</div>
								)}
							</div>

							{/* Customer Name - Now Optional */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Customer Name{" "}
									<span className="font-normal text-gray-500">(Optional)</span>
								</label>
								<div className="relative">
									<User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="text"
										value={formData.customerName}
										onChange={(e) =>
											handleInputChange("customerName", e.target.value)
										}
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
											errors.customerName
												? "border-red-300 bg-red-50"
												: "border-gray-300"
										}`}
										placeholder="Enter customer's full name (optional)"
										maxLength={100}
									/>
								</div>
								{errors.customerName && (
									<div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
										<AlertCircle className="w-3 h-3" />
										{errors.customerName}
									</div>
								)}
							</div>

							{/* Customer Phone */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Phone Number
								</label>
								<div className="relative">
									<Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="tel"
										value={formData.customerPhone}
										onChange={(e) =>
											handleInputChange("customerPhone", e.target.value)
										}
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
											errors.customerPhone
												? "border-red-300 bg-red-50"
												: "border-gray-300"
										}`}
										placeholder="09XX XXX XXXX or +639XX XXX XXXX"
										maxLength={13}
									/>
								</div>
								{errors.customerPhone && (
									<div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
										<AlertCircle className="w-3 h-3" />
										{errors.customerPhone}
									</div>
								)}
							</div>

							{/* Reference Number */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Reference Number
								</label>
								<div className="relative">
									<Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="text"
										value={formData.reference}
										onChange={(e) =>
											handleInputChange(
												"reference",
												e.target.value.toUpperCase()
											)
										}
										className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors font-mono ${
											errors.reference
												? "border-red-300 bg-red-50"
												: "border-gray-300"
										}`}
										placeholder="TXN123456789"
										maxLength={50}
									/>
								</div>
								{errors.reference && (
									<div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
										<AlertCircle className="w-3 h-3" />
										{errors.reference}
									</div>
								)}
							</div>

							{/* Notes */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Notes{" "}
									<span className="font-normal text-gray-500">(Optional)</span>
								</label>
								<div className="relative">
									<FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
									<textarea
										value={formData.notes}
										onChange={(e) => handleInputChange("notes", e.target.value)}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
										placeholder="Add any additional notes or comments..."
										rows={3}
										maxLength={500}
									/>
								</div>
								<div className="text-right text-xs text-gray-400 mt-1">
									{formData.notes.length}/500
								</div>
							</div>

							{/* Add some bottom padding for better scroll experience */}
							<div className="h-4"></div>
						</div>
					</div>

					{/* Action Buttons - Fixed at bottom */}
					<div className="flex-shrink-0 p-6 border-t border-gray-100 bg-white rounded-b-2xl">
						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								disabled={isSubmitting}
								className="cursor-pointer flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting || isCreating}
								className={`flex-1 px-4 py-3 text-white rounded-xl font-medium 
									flex items-center justify-center gap-2
									transition-all duration-200 cursor-pointer
									disabled:opacity-50 disabled:cursor-not-allowed
									${
										formData.type === TransactionType.CASH_IN
											? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
											: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
									}`}
							>
								{isSubmitting || isCreating ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Transaction"
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddTransactionModal;
