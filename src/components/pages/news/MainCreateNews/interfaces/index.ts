export interface PropsMainCreateNews {
	onClose: () => void;
	queryKeys: number[];
}

export interface IFormCreateNews {
	title: string;
	content: string;
	catalog: number;
	privacy: number;
	timePublic: string;
	isSpecial: boolean;
	link: string;
	sort: number;
	blockComment: boolean;
	imagePath: string;
}
