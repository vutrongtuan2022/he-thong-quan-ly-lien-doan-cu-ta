export interface Column<T> {
	checkBox?: boolean;
	fixedLeft?: boolean;
	fixedRight?: boolean;
	title: string | React.ReactNode;
	render: (data: T, index: number) => React.JSX.Element;
	className?: string;
}

export interface PropsTable<T> {
	data: T[];
	column: Column<T>[];
	fixedHeader?: boolean;

	// Checkbox handlers
	handleCheckedAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isCheckedAll?: boolean;
	handleCheckedRow?: (e: React.ChangeEvent<HTMLInputElement>, data: T) => void;
	handleIsCheckedRow?: (data: T) => boolean;
}
