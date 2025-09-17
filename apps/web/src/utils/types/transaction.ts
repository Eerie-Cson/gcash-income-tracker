export type Transaction = {
	id: string;
	description?: string;
	amount: number;
	transactionType: TransactionType;
	referenceNumber?: string;
	transasctionCode?: string;
	transactionDate: Date;
	profit: number;
};

export enum TransactionType {
	CASH_IN = "Cash-in",
	CASH_OUT = "Cash-out",
}
