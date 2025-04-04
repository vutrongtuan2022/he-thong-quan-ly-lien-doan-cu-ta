export interface PropsMainCreateNews {}

export interface IFormCreateNews {
	title: string;
	content: string;
	thumbnail: string;
	file: any;
	type: number;
	display: number;
	allowComments: 0 | 1;
	date: Date;
	order: number;
}
