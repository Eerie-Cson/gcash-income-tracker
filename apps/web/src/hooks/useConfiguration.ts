// hooks/useConfiguration.ts
import { manualWalletAdjustment } from "@/api/wallet";
import { saveTransactionFees, getTransactionFees } from "@/api/profit";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState, useEffect, useCallback } from "react";

export type FeeStructure = {
	id: string;
	minAmount: number;
	maxAmount: number;
	fee: number;
};

export type ConfigurationData = {
	cashBalance: number;
	gcashBalance: number;
	feeStructures: FeeStructure[];
};

export function useConfiguration() {
	const { balances, refetchBalances: refetchDashboardData } =
		useDashboardData();
	const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		loadFeeStructures();
	}, []);

	const loadFeeStructures = useCallback(async () => {
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
			} else {
				setFeeStructures([]);
			}
		} catch (error) {
			console.error("Failed to load fee structures:", error);
			setFeeStructures([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const initialData: ConfigurationData = {
		cashBalance: balances.cash,
		gcashBalance: balances.gcash,
		feeStructures: feeStructures,
	};

	const handleSave = useCallback(
		async (data: ConfigurationData) => {
			try {
				setIsSaving(true);

				// Update wallet balances
				await Promise.all([
					manualWalletAdjustment({
						amount: data.cashBalance,
						walletType: "Cash",
					}),
					manualWalletAdjustment({
						amount: data.gcashBalance,
						walletType: "Gcash",
					}),
				]);

				// Save transaction fees
				await saveTransactionFees(
					data.feeStructures.map((feeStructure) => ({
						minAmount: feeStructure.minAmount,
						maxAmount: feeStructure.maxAmount,
						fee: feeStructure.fee,
					}))
				);

				// Refetch data instead of page reload
				await Promise.all([refetchDashboardData(), loadFeeStructures()]);

				return { success: true };
			} catch (error) {
				console.error("Failed to save configuration:", error);
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to save configuration",
				};
			} finally {
				setIsSaving(false);
			}
		},
		[refetchDashboardData, loadFeeStructures]
	);

	const refreshData = useCallback(async () => {
		await Promise.all([refetchDashboardData(), loadFeeStructures()]);
	}, [refetchDashboardData, loadFeeStructures]);

	return {
		initialData,
		handleSave,
		isLoading,
		isSaving,
		refreshData,
	};
}
