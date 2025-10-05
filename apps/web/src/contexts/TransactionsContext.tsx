"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useTransactionsApi, CreatePayload } from "@/hooks/useTransactionsApi";

const TransactionsContext = createContext<
	ReturnType<typeof useTransactionsApi> | undefined
>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
	const transactionsApi = useTransactionsApi();

	return (
		<TransactionsContext.Provider value={transactionsApi}>
			{children}
		</TransactionsContext.Provider>
	);
}

export function useTransactions() {
	const context = useContext(TransactionsContext);
	if (context === undefined) {
		throw new Error(
			"useTransactions must be used within a TransactionsProvider"
		);
	}
	return context;
}
