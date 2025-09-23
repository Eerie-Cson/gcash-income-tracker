export enum NotificationType {
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning",
}

export type NotificationState = {
	isOpen: boolean;
	type: NotificationType;
	title: string;
	message?: string;
};
