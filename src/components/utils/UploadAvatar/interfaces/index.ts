import {Dispatch, SetStateAction} from 'react';

export interface PropsUploadAvatar {
	path: any;
	name: string;
	onSetFile: Dispatch<SetStateAction<any>>;
	resetPath?: () => void;
}
