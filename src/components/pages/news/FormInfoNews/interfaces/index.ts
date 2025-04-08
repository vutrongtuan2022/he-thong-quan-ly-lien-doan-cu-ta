import {Dispatch, SetStateAction} from 'react';
import {IFormCreateNews} from '../../MainCreateNews/interfaces';

export interface PropsFormInfoNews {
	form: IFormCreateNews;
	setForm: React.Dispatch<React.SetStateAction<IFormCreateNews>>;
	setFile: React.Dispatch<React.SetStateAction<any>>;
	file: any;
}
