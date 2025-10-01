import { Plus } from "lucide-react";

const AddTransactionButton = ({ openModal }: { openModal: () => void }) => {
	return (
		<>
			<button
				onClick={openModal}
				className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm whitespace-nowrap"
			>
				<Plus className="w-4 h-4" />
				Add Transaction
			</button>
		</>
	);
};

export default AddTransactionButton;
