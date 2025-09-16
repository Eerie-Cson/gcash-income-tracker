export const fmt = (v: number) => `₱${v.toLocaleString()}`;
export const fmtDate = (d: Date) =>
	d.toLocaleString(undefined, { month: "short", day: "numeric" });
export const fmtTime = (d: Date) =>
	d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
