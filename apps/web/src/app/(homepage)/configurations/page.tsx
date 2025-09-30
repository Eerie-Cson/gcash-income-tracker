"use client";

import { manualWalletAdjustment } from "@/api/wallet";
import Configuration from "@/components/configuration/Configuration";
import { useDashboardData } from "@/hooks/useDashboardData";

type FeeStructure = {
	id: string;
	minAmount: number;
	maxAmount: number;
	profit: number;
};
export default function ConfigurationPage() {
	const { balances } = useDashboardData();

	const initialData: {
		cashBalance: number;
		gcashBalance: number;
		feeStructures: FeeStructure[];
	} = {
		cashBalance: balances.cash,
		gcashBalance: balances.gcash,
		feeStructures: [
			{ id: "1", minAmount: 1, maxAmount: 45, profit: 5 },
			{ id: "2", minAmount: 46, maxAmount: 250, profit: 10 },
			{ id: "3", minAmount: 251, maxAmount: 1000, profit: 15 },
		],
	};

	const handleSave = async (data: any) => {
		console.log("Saving configuration:", data);

		try {
			//To be refactored in the future, call the api only when it was changed.

			await manualWalletAdjustment({
				amount: data.cashBalance,
				walletType: "Cash",
			});

			await manualWalletAdjustment({
				amount: data.gcashBalance,
				walletType: "Gcash",
			});

			window.location.reload();
		} catch (error) {
			console.error("Failed to save configuration:", error);
			alert("Failed to save configuration. Please try again.");
		}
	};

	return <Configuration initialData={initialData} onSave={handleSave} />;
}
