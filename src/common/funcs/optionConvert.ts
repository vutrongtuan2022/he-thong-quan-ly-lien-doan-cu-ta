import md5 from 'md5';
import moment from 'moment';

export function removeVietnameseTones(str: string): string {
	return str
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
}

export function convertWeight(weight: number | null) {
	if (!weight) {
		return 0;
	}

	return (weight / 1000).toLocaleString('vi-VN', {minimumFractionDigits: 3, maximumFractionDigits: 3});
}

export function obfuscateEmail(email: string) {
	// Tách phần trước @ và phần tên miền
	const [username, domain] = email.split('@');

	// Giữ lại ký tự đầu tiên và cuối cùng của tên người dùng
	const firstChar = username[0];
	const lastChar = username[username.length - 1];

	// Tạo phần che giấu giữa
	const middleHidden = '...';

	// Tạo tên người dùng mới với phần che giấu
	const newUsername = firstChar + middleHidden + lastChar;

	// Kết hợp với tên miền để tạo email đã che giấu
	const obfuscatedEmail = newUsername + '@' + domain;

	return obfuscatedEmail;
}

export default function fancyTimeFormat(duration: number) {
	// Hours, minutes and seconds
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = '';

	if (hrs > 0) {
		ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
	}

	ret += '' + mins + ':' + (secs < 10 ? '0' : '');
	ret += '' + secs;
	return ret;
}

export function getKeyCert(): {
	time: string;
	keyCert: string;
} {
	const key: string = process.env.NEXT_PUBLIC_KEY_CERT!;
	const time = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');

	return {
		time: time,
		keyCert: md5(`${key}${time}`),
	};
}

export function getTextAddress(detailAddress: any, address?: string): string {
	if (!detailAddress?.province && !detailAddress?.district && !detailAddress?.town && !address) {
		return '---';
	}

	const parts = [address, detailAddress?.town?.name, detailAddress?.district?.name, detailAddress?.province?.name].filter(Boolean);

	return parts.length ? parts.join(', ') : '---';
}

export function convertFileSize(fileSizeInKB: number) {
	if (typeof fileSizeInKB !== 'number' || fileSizeInKB < 0) {
		return 'Kích thước không hợp lệ';
	}

	if (fileSizeInKB < 1024) {
		return fileSizeInKB.toFixed(2) + ' kb';
	} else if (fileSizeInKB < 1048576) {
		// 1024 KB = 1 MB
		return (fileSizeInKB / 1024).toFixed(2) + ' mb';
	} else if (fileSizeInKB < 1073741824) {
		// 1024 MB = 1 GB
		return (fileSizeInKB / 1048576).toFixed(2) + ' gb';
	} else {
		return (fileSizeInKB / 1073741824).toFixed(2) + ' tb';
	}
}
