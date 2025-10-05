"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Configuration from "@/components/configuration/Configuration";
import { useConfiguration } from "@/hooks/useConfiguration";
import Spinner from "@/ui/Spinner";

export default function ConfigurationPage() {
	const { initialData, handleSave, isLoading } = useConfiguration();

	if (isLoading) {
		return (
			<ProtectedRoute>
				<Spinner
					message="Loading configuration..."
					className="p-4 md:p-6 min-h-64"
				/>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<Configuration initialData={initialData} onSave={handleSave} />
		</ProtectedRoute>
	);
}
