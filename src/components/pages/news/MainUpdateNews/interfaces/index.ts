export interface PropsMainUpdateNews {}

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
