// components/ui/Spinner.tsx
import React from "react";

type SpinnerProps = {
	size?: string;
	message?: string;
	fullScreen?: boolean;
	className?: string;
};

export default function Spinner({
	size = "h-12 w-12",
	message,
	className = "",
}: SpinnerProps) {
	return (
		<div
			role="status"
			aria-live="polite"
			className={`flex items-center justify-center ${className}`.trim()}
		>
			<div className="text-center">
				<div
					className={`animate-spin rounded-full ${size} border-b-2 border-emerald-600 mx-auto`}
					aria-hidden="true"
				/>
				{message && <p className="text-slate-600 mt-3">{message}</p>}
			</div>
		</div>
	);
}
