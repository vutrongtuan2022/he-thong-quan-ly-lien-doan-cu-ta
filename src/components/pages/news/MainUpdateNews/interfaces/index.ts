export interface PropsMainUpdateNews {
	uuid: string;
}

export interface IFormUpdateNews {
	title: string;
	content: string;
	catalog: number;
	privacy: number;
	timePublic: string | Date;
	isSpecial: boolean;
	link: string;
	sort: number;
	blockComment: boolean;
	imagePath: string;
}
