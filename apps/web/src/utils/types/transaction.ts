export type Transaction = {
	description?: string;
	amount: number;
	transactionType: TransactionType;
	referenceNumber?: string;
	transasctionCode?: string;
	transactionDate: Date;
	profit: number;
};

export type TransactionType = "Cash-in" | "Cash-out";
