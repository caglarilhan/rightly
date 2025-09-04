export function getApiBase(): string {
	const base = process.env.API_URL;
	if (!base) {
		throw new Error("Missing API_URL (set in .env.local)");
	}
	return base.replace(/\/+$/, "");
}


