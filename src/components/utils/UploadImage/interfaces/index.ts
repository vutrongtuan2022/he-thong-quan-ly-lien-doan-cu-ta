export interface PropsUploadImage {
	isWidthFull?: boolean;
	label?: string | React.ReactNode;
	name: string;
	path: string;
	file: any;
	setFile: (any: any) => void;
}
