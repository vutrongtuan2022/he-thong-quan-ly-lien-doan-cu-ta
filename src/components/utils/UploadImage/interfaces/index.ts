export interface PropsUploadImage {
	isWidthFull?: boolean;
	label?: string | React.ReactNode;
	name: string;
	file: any;
	setFile: (any: any) => void;
	path: string;
	resetPath?: () => void;
}
