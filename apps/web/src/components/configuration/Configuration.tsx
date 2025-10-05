"use client";

import {
	AlertCircle,
	DollarSign,
	Info,
	Plus,
	Save,
	Trash2,
	Wallet,
} from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Notification, { NotificationType } from "../../ui/Notification";

interface FeeStructure {
	id: string;
	minAmount: number;
	maxAmount: number;
	fee: number;
}

interface ConfigurationData {
	cashBalance: number;
	gcashBalance: number;
	feeStructures: FeeStructure[];
}

interface ConfigurationProps {
	onSave?: (
		data: ConfigurationData
	) => Promise<{ success: boolean; error?: string }>;

	initialData?: ConfigurationData;
}

export default function Configuration({
	onSave,
	initialData,
}: ConfigurationProps) {
	const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

	const [isSaving, setIsSaving] = useState(false);

	const [cashBalance, setCashBalance] = useState<number>(
		initialData?.cashBalance || 0
	);
	const [gcashBalance, setGcashBalance] = useState(
		initialData?.gcashBalance || 0
	);

	const [isModified, setIsModified] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
		null
	);
	const [notification, setNotification] = useState({
		isOpen: false,
		type: "success" as NotificationType,
		title: "",
		message: "",
	});

	useEffect(() => {
		if (initialData) {
			setCashBalance(initialData.cashBalance);
			setGcashBalance(initialData.gcashBalance);
			setFeeStructures(initialData.feeStructures);
			setIsModified(false);
		}
	}, [initialData]);

	const hasOverlaps = useMemo(() => {
		const sorted = [...feeStructures].sort((a, b) => a.minAmount - b.minAmount);
		for (let i = 0; i < sorted.length - 1; i++) {
			if (sorted[i].maxAmount >= sorted[i + 1].minAmount) {
				return true;
			}
		}
		return false;
	}, [feeStructures]);

	const hasEmptyRanges = useMemo(() => {
		return feeStructures.some(
			(s) => s.minAmount >= s.maxAmount || s.minAmount < 0 || s.fee < 0
		);
	}, [feeStructures]);

	const isValid = !hasOverlaps && !hasEmptyRanges && feeStructures.length > 0;

	const showNotification = useCallback(
		(title: string, type: NotificationType, message?: string) => {
			setNotification({
				isOpen: true,
				type,
				title,
				message: message || "",
			});
		},
		[]
	);

	const hideNotification = useCallback(() => {
		setNotification((prev) => ({ ...prev, isOpen: false }));
	}, []);

	const addFeeStructure = useCallback(() => {
		const lastStructure = [...feeStructures].sort(
			(a, b) => b.maxAmount - a.maxAmount
		)[0];
		const newMinAmount = lastStructure ? lastStructure.maxAmount + 1 : 1;

		const newStructure: FeeStructure = {
			id: Date.now().toString(),
			minAmount: newMinAmount,
			maxAmount: newMinAmount + 99,
			fee: 5,
		};
		setFeeStructures((prev) => [...prev, newStructure]);
		setIsModified(true);
	}, [feeStructures]);

	const updateFeeStructure = useCallback(
		(id: string, field: keyof Omit<FeeStructure, "id">, value: number) => {
			setFeeStructures((prev) =>
				prev.map((structure) =>
					structure.id === id ? { ...structure, [field]: value } : structure
				)
			);
			setIsModified(true);
		},
		[]
	);

	const removeFeeStructure = useCallback((id: string) => {
		setFeeStructures((prev) => prev.filter((structure) => structure.id !== id));
		setIsModified(true);
		setShowDeleteConfirm(null);
	}, []);

	const handleBalanceChange = useCallback(
		(type: "cash" | "gcash", value: number) => {
			if (type === "cash") {
				setCashBalance(value);
			} else {
				setGcashBalance(value);
			}
			setIsModified(true);
		},
		[]
	);

	const handleSave = useCallback(async () => {
		if (!isValid) {
			showNotification(
				"Configuration Invalid",
				"error",
				"Please fix the configuration issues before saving."
			);
			return;
		}

		if (!onSave) return;

		setIsSaving(true);

		const data = {
			cashBalance,
			gcashBalance,
			feeStructures: feeStructures.sort((a, b) => a.minAmount - b.minAmount),
		};

		const result = await onSave(data);

		if (result.success) {
			setIsModified(false);
			showNotification(
				"Configuration Saved Successfully!",
				"success",
				"Your business configuration has been updated and is now active."
			);
		} else {
			showNotification(
				"Save Failed",
				"error",
				result.error || "Failed to save configuration. Please try again."
			);
		}
	}, [
		cashBalance,
		gcashBalance,
		feeStructures,
		onSave,
		isValid,
		showNotification,
	]);

	const totalBalance = cashBalance + gcashBalance;

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
							Business Configuration
						</h1>
						<p className="text-slate-600 text-sm lg:text-base">
							Manage your wallet balances and transaction fee structure
						</p>
					</div>

					<div className="flex items-center gap-3">
						{/* Status indicator for unsaved changes */}
						{isModified && (
							<div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
								<AlertCircle className="w-4 h-4 text-amber-600" />
								<span className="text-amber-700 text-sm font-medium">
									Unsaved
								</span>
							</div>
						)}

						<button
							onClick={handleSave}
							disabled={!isModified || !isValid || isSaving}
							className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium shadow-sm whitespace-nowrap ${
								!isModified || !isValid || isSaving
									? "bg-slate-100 text-slate-400 cursor-not-allowed"
									: "bg-emerald-600 text-white hover:bg-emerald-700"
							}`}
						>
							<Save className="w-4 h-4" />
							{isSaving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>

				{/* Breadcrumb */}
				<nav className="flex items-center text-sm text-slate-500">
					<Link
						href="/dashboard"
						className="hover:text-slate-700 transition-colors cursor-pointer"
					>
						Home
					</Link>
					<span className="mx-2 text-slate-400">/</span>
					<span className="font-medium text-emerald-600 cursor-default">
						Configuration
					</span>
				</nav>

				{/* Validation Messages */}
				{!isValid && feeStructures.length > 0 && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-4">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
							<div>
								<p className="text-red-800 font-medium">
									Configuration Issues Found
								</p>
								<ul className="text-red-700 text-sm mt-2 space-y-1">
									{hasOverlaps && <li>• Fee ranges are overlapping</li>}
									{hasEmptyRanges && (
										<li>• Some ranges are invalid or have negative values</li>
									)}
								</ul>
							</div>
						</div>
					</div>
				)}

				{/* Wallet Balances Section */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
					<div className="px-6 py-4 border-b border-slate-200">
						<div className="flex items-center gap-3">
							<Wallet className="w-5 h-5 text-emerald-600" />
							<div>
								<h2 className="text-lg font-semibold text-slate-900">
									Wallet Balances
								</h2>
								<p className="text-sm text-slate-600">
									Configure your initial cash and digital wallet amounts
								</p>
							</div>
						</div>
					</div>

					<div className="p-6">
						<div className="grid lg:grid-cols-2 gap-6">
							{/* GCash Digital Wallet */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-blue-500" />
									<h3 className="font-medium text-slate-900">GCash Digital</h3>
								</div>
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
										₱
									</span>
									<input
										type="number"
										value={gcashBalance}
										onChange={(e) =>
											handleBalanceChange("gcash", Number(e.target.value))
										}
										className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xl font-bold"
										placeholder="0.00"
										min="0"
										step="0.01"
									/>
								</div>
								<div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
									<Info className="w-4 h-4 text-slate-500 mt-0.5" />
									<div className="text-sm text-slate-600">
										<p className="font-medium mb-1">Digital balance</p>
										<p>GCash wallet balance for cash-in transactions</p>
									</div>
								</div>
							</div>
							{/* Physical Cash */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-emerald-500" />
									<h3 className="font-medium text-slate-900">Physical Cash</h3>
								</div>
								<div className="relative">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
										₱
									</span>
									<input
										type="number"
										value={cashBalance}
										onChange={(e) =>
											handleBalanceChange("cash", Number(e.target.value))
										}
										className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xl font-bold"
										placeholder="0.00"
										min="0"
										step="0.01"
									/>
								</div>
								<div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
									<Info className="w-4 h-4 text-slate-500 mt-0.5" />
									<div className="text-sm text-slate-600">
										<p className="font-medium mb-1">Cash on hand</p>
										<p>Physical money available for cash-out transactions</p>
									</div>
								</div>
							</div>
						</div>

						{/* Balance Summary */}
						<div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-emerald-800">
										Total Available Balance
									</p>
									<p className="text-sm text-emerald-600">
										Combined cash and digital funds
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold text-emerald-900">
										₱{totalBalance.toLocaleString()}
									</p>
									<div className="flex gap-3 text-sm text-emerald-700 mt-1">
										<span>Cash: ₱{cashBalance.toLocaleString()}</span>
										<span>•</span>
										<span>GCash: ₱{gcashBalance.toLocaleString()}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Transaction Fee Structure Section */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
					<div className="px-6 py-4 border-b border-slate-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<DollarSign className="w-5 h-5 text-blue-600" />
								<div>
									<h2 className="text-lg font-semibold text-slate-900">
										Fee Structure
									</h2>
									<p className="text-sm text-slate-600">
										Define profit margins for different transaction amounts
									</p>
								</div>
							</div>
							<button
								onClick={addFeeStructure}
								className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm whitespace-nowrap"
							>
								<Plus className="w-4 h-4" />
								Add Fee Tier
							</button>
						</div>
					</div>

					<div className="p-6">
						{feeStructures.length === 0 ? (
							<div className="text-center py-8">
								<div className="w-12 h-12 mx-auto mb-4 bg-slate-100 rounded-xl flex items-center justify-center">
									<DollarSign className="w-6 h-6 text-slate-400" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900 mb-2">
									No Fee Structure Set
								</h3>
								<p className="text-slate-600 mb-4">
									Create your first fee tier to start earning profits
								</p>
								<button
									onClick={addFeeStructure}
									className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
								>
									<Plus className="w-4 h-4" />
									Create Fee Tier
								</button>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full min-w-[700px]">
									<thead className="bg-slate-50 border-b border-slate-200">
										<tr>
											<th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
												Min Amount
											</th>
											<th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
												Max Amount
											</th>
											<th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
												Transaction Fee
											</th>
											<th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
												Range
											</th>
											<th className="text-left px-4 py-3 text-sm font-medium text-slate-700">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-200">
										{feeStructures
											.sort((a, b) => a.minAmount - b.minAmount)
											.map((structure) => {
												const rangeSize =
													structure.maxAmount - structure.minAmount + 1;
												const isInvalid =
													structure.minAmount >= structure.maxAmount ||
													structure.minAmount < 0 ||
													structure.fee < 0;

												return (
													<tr
														key={structure.id}
														className={`transition-colors ${
															isInvalid ? "bg-red-50" : "hover:bg-slate-50"
														}`}
													>
														<td className="px-4 py-3">
															<div className="relative">
																<span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
																	₱
																</span>
																<input
																	type="number"
																	value={structure.minAmount}
																	onChange={(e) =>
																		updateFeeStructure(
																			structure.id,
																			"minAmount",
																			Number(e.target.value)
																		)
																	}
																	className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
																	min="0"
																	step="1"
																/>
															</div>
														</td>
														<td className="px-4 py-3">
															<div className="relative">
																<span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
																	₱
																</span>
																<input
																	type="number"
																	value={structure.maxAmount}
																	onChange={(e) =>
																		updateFeeStructure(
																			structure.id,
																			"maxAmount",
																			Number(e.target.value)
																		)
																	}
																	className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
																	min="0"
																	step="1"
																/>
															</div>
														</td>
														<td className="px-4 py-3">
															<div className="relative">
																<span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
																	₱
																</span>
																<input
																	type="number"
																	value={structure.fee}
																	onChange={(e) =>
																		updateFeeStructure(
																			structure.id,
																			"fee",
																			Number(e.target.value)
																		)
																	}
																	className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
																	min="0"
																	step="0.01"
																/>
															</div>
														</td>
														<td className="px-4 py-3">
															<span className="text-sm text-slate-600">
																{rangeSize.toLocaleString()} amounts
															</span>
														</td>
														<td className="px-4 py-3">
															{/* {feeStructures.length > 1 && ( */}
															<button
																onClick={() =>
																	setShowDeleteConfirm(structure.id)
																}
																className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
																title="Delete fee tier"
															>
																<Trash2 className="w-4 h-4" />
															</button>
															{/* )} */}
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						)}

						{/* Fee Structure Summary */}
						{feeStructures.length > 0 && isValid && (
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h3 className="font-medium text-slate-900 mb-3">
									Fee Structure Summary
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{feeStructures
										.sort((a, b) => a.minAmount - b.minAmount)
										.map((structure) => (
											<div
												key={structure.id}
												className="flex justify-between items-center py-2 px-3 bg-white rounded-lg text-sm"
											>
												<span className="text-slate-700">
													₱{structure.minAmount.toLocaleString()} - ₱
													{structure.maxAmount.toLocaleString()}
												</span>
												<span className="font-semibold text-emerald-600">
													₱{structure.fee} profit
												</span>
											</div>
										))}
								</div>
							</div>
						)}
					</div>
				</div>

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
										Delete Fee Tier
									</h2>
								</div>

								<p className="text-slate-600 mb-6">
									Are you sure you want to delete this fee tier? This action
									cannot be undone.
								</p>

								<div className="flex gap-3">
									<button
										onClick={() => setShowDeleteConfirm(null)}
										className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										onClick={() => removeFeeStructure(showDeleteConfirm)}
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
}
