export interface PropsCommentNews {}

export interface IComment {
	profileUser: {
		name: string;
		imagePath: string;
		uuid: string;
	};
	content: string;
	timeAgo: string;
	created: string;
	updated: string;
	status: number;
	uuid: string;
}
