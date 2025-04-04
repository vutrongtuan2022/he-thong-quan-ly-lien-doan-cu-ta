// Hàm chuyển đổi số coin thành chuỗi định dạng tiền tệ
export const convertCoin = (coin: number | null) => {
	return coin ? coin.toLocaleString('de-DE', {maximumFractionDigits: 2}) : '0';
};

// Hàm chuyển đổi chuỗi hoặc số thành giá trị số
export const price = (value: string | number): number => {
	const numericValue = Number(`${value}`.replace(/[^0-9,]/g, '').replace(',', '.'));
	return isNaN(numericValue) ? 0 : numericValue;
};

export function getTextAddress(addressInfo?: {
	address1: string;
	tp: {
		code: string;
		name: string;
		uuid: string;
	};
	qh: {
		code: string;
		name: string;
		uuid: string;
	};
	xa: {
		code: string;
		name: string;
		uuid: string;
	};
	uuid: string;
}): string {
	if (!addressInfo) return '';

	const {address1, tp, qh, xa} = addressInfo;

	return [address1, xa?.name, qh?.name, tp?.name].filter((item) => item && item.trim() !== '').join(', ');
}
