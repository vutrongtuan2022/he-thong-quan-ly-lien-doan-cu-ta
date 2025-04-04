export interface PropsStateActive {
	isBox?: boolean;
	isSmall?: boolean;
	stateActive: number;
	borderRadius?: number;
	listState: {
		state: number;
		text: string;
		backgroundColor: string;
		textColor?: string;
	}[];
}
