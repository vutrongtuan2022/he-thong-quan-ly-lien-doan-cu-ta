import React, {useEffect, useState} from 'react';

import {PropsUploadAvatar} from './interfaces';
import styles from './UploadAvatar.module.scss';
import {toastError, toastWarn} from '~/common/funcs/toast';
import Image from 'next/image';
import icons from '~/constants/images/icons';

const MAXIMUM_FILE = 10;

function UploadAvatar({path, name, onSetFile, resetPath}: PropsUploadAvatar) {
	const [imageBase64, setImageBase64] = useState<string>('');
	const [fileName, setFileName] = useState<string>('');

	const handleSelectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const {size, type, name} = file;
			const maxSize = MAXIMUM_FILE; // MB

			if (size / 1000000 > maxSize) {
				return toastError({msg: `Kích thước tối đa của ảnh là ${maxSize} MB`});
			} else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(type)) {
				return toastWarn({msg: `Định dạng tệp không chính xác, chỉ chấp nhận .jpg, .jpeg, .png`});
			}

			const imageUrl = URL.createObjectURL(file);
			setImageBase64((prev) => {
				URL.revokeObjectURL(prev);
				return imageUrl;
			});
			setFileName(name);
			onSetFile && onSetFile(file);
		}
	};

	useEffect(() => {
		return () => {
			if (imageBase64) {
				URL.revokeObjectURL(imageBase64);
			}
		};
	}, [imageBase64]);

	const handleRemoveImg = () => {
		setImageBase64('');
		setFileName('');
		onSetFile && onSetFile(null);
		resetPath && resetPath();
	};

	return (
		<div className={styles.container}>
			<Image alt='update avatar' src={!!imageBase64 ? imageBase64 : path} width={80} height={80} className={styles.avatar} />
			<div className={styles.main}>
				<div className={styles.control}>
					<label className={styles.box_input}>
						<input
							hidden
							type='file'
							accept='image/png, image/jpeg, image/jpg'
							name={name}
							onChange={handleSelectImg}
							onClick={(e) => ((e.target as HTMLInputElement).value = '')}
						/>
						<div className={styles.file}>
							<p>Chọn file</p>
						</div>
						<div className={styles.name_file}>
							<p>{fileName || 'Tên file'}</p>
						</div>
					</label>
					<div className={styles.btn} onClick={handleRemoveImg}>
						<Image alt='Xóa' src={icons.trash} width={20} height={20} />
						<p>Xóa ảnh đại diện</p>
					</div>
				</div>
				<p>Hình ảnh được dùng làm ảnh đại diện, kích thước tối thiểu 300px X 300px để đảm bảo độ sắc nét.</p>
			</div>
		</div>
	);
}

export default UploadAvatar;
