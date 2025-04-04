import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SiteState {
	loading: boolean;
	isRememberPassword: boolean;
}

const initialState: SiteState = {
	loading: true,
	isRememberPassword: false,
};

export const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action?.payload;
		},
		setRememberPassword: (state, action: PayloadAction<boolean>) => {
			state.isRememberPassword = action.payload;
		},
	},
});

export const {setLoading, setRememberPassword} = siteSlice.actions;
// Action creators are generated for each case reducer function
export default siteSlice.reducer;
