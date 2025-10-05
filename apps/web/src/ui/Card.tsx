"use client";
import React from "react";

interface CardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	children?: React.ReactNode;
	className?: string;
}

export default function Card({
	title,
	value,
	subtitle,
	children,
	className = "",
}: CardProps) {
	return (
		<div>
			<div
				className={`bg-teal-50 rounded-2xl p-5 shadow-sm border border-l-5 border-l-emerald-500 border-slate-100 ${className}`}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<div className="text-sm text-slate-500">{title}</div>
						<div className="mt-2 text-2xl font-bold text-emerald-600">
							{value}
						</div>
						{subtitle && (
							<div className="text-xs text-slate-400 mt-1">{subtitle}</div>
						)}
					</div>
					<div className="w-24 h-12 flex items-center justify-end">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
