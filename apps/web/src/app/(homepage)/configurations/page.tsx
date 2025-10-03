"use client";

import { manualWalletAdjustment } from "@/api/wallet";
import Configuration from "@/components/configuration/Configuration";
import { useDashboardData } from "@/hooks/useDashboardData";
import { saveTransactionFees, getTransactionFees } from "@/api/profit";
import { useState, useEffect } from "react";

type FeeStructure = {
	id: string;
	minAmount: number;
	maxAmount: number;
	fee: number;
};

export default function ConfigurationPage() {
	const { balances } = useDashboardData();
	const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadFeeStructures();
	}, []);

	const loadFeeStructures = async () => {
		try {
			setIsLoading(true);
			const feesData = await getTransactionFees();

			if (feesData && Array.isArray(feesData)) {
				const transformedFees = feesData.map((fee, index: number) => ({
					id: fee.id || `fee-${Date.now()}-${index}`,
					minAmount: Number(fee.minAmount),
					maxAmount: Number(fee.maxAmount),
					fee: Number(fee.profit),
				}));
				setFeeStructures(transformedFees);
			}
		} catch (error) {
			console.error("Failed to load fee structures:", error);
			setFeeStructures([]);
		} finally {
			setIsLoading(false);
		}
	};

	const initialData: {
		cashBalance: number;
		gcashBalance: number;
		feeStructures: FeeStructure[];
	} = {
		cashBalance: balances.cash,
		gcashBalance: balances.gcash,
		feeStructures: feeStructures,
	};

	const handleSave = async (data: {
		cashBalance: number;
		gcashBalance: number;
		feeStructures: FeeStructure[];
	}) => {
		try {
			await manualWalletAdjustment({
				amount: data.cashBalance,
				walletType: "Cash",
			});

			await manualWalletAdjustment({
				amount: data.gcashBalance,
				walletType: "Gcash",
			});

			await saveTransactionFees(
				data.feeStructures.map((feeStructure: FeeStructure) => ({
					minAmount: feeStructure.minAmount,
					maxAmount: feeStructure.maxAmount,
					fee: feeStructure.fee,
				}))
			);

			window.location.reload();
		} catch (error) {
			console.error("Failed to save configuration:", error);
			alert("Failed to save configuration. Please try again.");
		}
	};

	if (isLoading) {
		return (
			<div className="p-4 md:p-6 flex justify-center items-center min-h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
					<p className="text-slate-600">Loading configuration...</p>
				</div>
			</div>
		);
	}

	return <Configuration initialData={initialData} onSave={handleSave} />;
}
