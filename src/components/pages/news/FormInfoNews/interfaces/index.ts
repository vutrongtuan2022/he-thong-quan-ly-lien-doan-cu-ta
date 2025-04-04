import {Dispatch, SetStateAction} from 'react';
import {IFormCreateNews} from '../../MainCreateNews/interfaces';

export interface PropsFormInfoNews {
	form: IFormCreateNews;
	setForm: Dispatch<SetStateAction<IFormCreateNews>>;
}
