export const fmt = (v: number) => `₱${v.toLocaleString()}`;
export const fmtDate = (d: Date) =>
	d.toLocaleString(undefined, { month: "short", day: "numeric" });
export const fmtTime = (d: Date | string) => {
	if (typeof d === "string") {
		d = new Date(d);
	}

	return d.toLocaleTimeString(undefined, {
		hour: "numeric",
		minute: "2-digit",
	});
};

export const fmtSmartDateTime = (input: Date | string) => {
	const date = typeof input === "string" ? new Date(input) : input;

	if (isNaN(date.getTime())) return "Invalid date";

	const now = new Date();
	const dateOnly = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	let label: string;

	if (dateOnly.getTime() === today.getTime()) {
		label = "Today";
	} else if (dateOnly.getTime() === yesterday.getTime()) {
		label = "Yesterday";
	} else {
		label = date.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	const timePart = date.toLocaleTimeString(undefined, {
		hour: "numeric",
		minute: "2-digit",
	});

	return `${label} at ${timePart}`;
};
