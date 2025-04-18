export interface PropsFormCreateExpertise {
	uuid: string;
	onClose: () => void;
	queryKeys: number[];
}
export interface IFormCreateExpertise {
	fullname: string;
	expertiseType: number | null;
	// uuid: string;
}
