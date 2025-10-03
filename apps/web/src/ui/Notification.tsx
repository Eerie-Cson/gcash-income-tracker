import React, { useEffect } from "react";
import {
	CheckCircle2,
	X,
	// AlertCircle,
	AlertTriangle,
	Info,
	XCircle,
} from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
	isOpen: boolean;
	onClose: () => void;
	type?: NotificationType;
	title: string;
	message?: string;
	duration?: number;
	showCloseButton?: boolean;
	autoClose?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
	isOpen,
	onClose,
	type = "success",
	title,
	message,
	duration = 5000,
	showCloseButton = true,
	autoClose = true,
}) => {
	useEffect(() => {
		if (isOpen && autoClose) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [isOpen, autoClose, duration, onClose]);

	if (!isOpen) return null;

	const getIcon = () => {
		switch (type) {
			case "success":
				return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
			case "error":
				return <XCircle className="w-5 h-5 text-red-600" />;
			case "warning":
				return <AlertTriangle className="w-5 h-5 text-amber-600" />;
			case "info":
				return <Info className="w-5 h-5 text-blue-600" />;
			default:
				return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
		}
	};

	const getBackgroundColor = () => {
		switch (type) {
			case "success":
				return "bg-emerald-50 border-emerald-200";
			case "error":
				return "bg-red-50 border-red-200";
			case "warning":
				return "bg-amber-50 border-amber-200";
			case "info":
				return "bg-blue-50 border-blue-200";
			default:
				return "bg-emerald-50 border-emerald-200";
		}
	};

	const getTextColor = () => {
		switch (type) {
			case "success":
				return "text-emerald-800";
			case "error":
				return "text-red-800";
			case "warning":
				return "text-amber-800";
			case "info":
				return "text-blue-800";
			default:
				return "text-emerald-800";
		}
	};

	return (
		<div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right duration-300">
			<div
				className={`border rounded-xl shadow-lg p-4 min-w-[320px] max-w-md ${getBackgroundColor()}`}
			>
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
						{getIcon()}
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<h3 className={`text-sm font-semibold ${getTextColor()}`}>
								{title}
							</h3>
							{showCloseButton && (
								<button
									onClick={onClose}
									className="flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-white/50"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
						{message && (
							<p className={`text-sm mt-1 ${getTextColor()}`}>{message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notification;
