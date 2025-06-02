export interface PropsImportExcel {
	name: string;
	file: any;
	pathTemplate: string;
	setDataReadFile?: (any: any) => void;
	setFile: (any: any) => void;
	onClose: () => void;
	onSubmit: () => void;
}
