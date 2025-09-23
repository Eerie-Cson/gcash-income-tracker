import { useState, useCallback } from "react";
import { NotificationState, NotificationType } from "@/utils/types";

export const useNotification = () => {
	const [notification, setNotification] = useState<NotificationState>({
		isOpen: false,
		type: NotificationType.SUCCESS,
		title: "",
		message: "",
	});

	const showNotification = useCallback(
		(
			title: string,
			type: NotificationType = NotificationType.SUCCESS,
			message?: string
		) => {
			setNotification({
				isOpen: true,
				type,
				title,
				message,
			});
		},
		[]
	);

	const hideNotification = useCallback(() => {
		setNotification((prev) => ({ ...prev, isOpen: false }));
	}, []);

	return {
		notification,
		showNotification,
		hideNotification,
	};
};
