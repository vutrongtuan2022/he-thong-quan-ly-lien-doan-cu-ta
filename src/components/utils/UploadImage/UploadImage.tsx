import React, {useEffect, useState} from 'react';

import {PropsUploadImage} from './interfaces';
import styles from './UploadImage.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {toastError, toastWarn} from '~/common/funcs/toast';
import {IoClose} from 'react-icons/io5';

const MAXIMUM_FILE = 10; // MB

function UploadImage({label, name, path, file, setFile, isWidthFull = true}: PropsUploadImage) {
	const [dragging, setDragging] = useState<boolean>(false);
	const [imageBase64, setImageBase64] = useState<string>('');

	const handleDragEnter = (e: any) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const validateFile = (file: any) => {
		if (file) {
			const {size, type} = file;
			const maxSize = MAXIMUM_FILE;

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
			setFile(file);
		}
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		setDragging(false);

		const file = e.dataTransfer.files[0];

		return validateFile(file);
	};

	const handleSelectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		return validateFile(file);
	};

	useEffect(() => {
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImageBase64((prev) => {
				URL.revokeObjectURL(prev);
				return imageUrl;
			});
			setFile(file);
		}
	}, [file]);

	useEffect(() => {
		return () => {
			if (imageBase64) {
				URL.revokeObjectURL(imageBase64);
			}
		};
	}, [imageBase64]);

	const handleRemoveImg = () => {
		setImageBase64('');
		setFile(null);
	};

	return (
		<div className={styles.container}>
			{label ? <p className={styles.label}>{label}</p> : null}
			{imageBase64 || path ? (
				<div
					className={clsx(styles.main, {
						[styles.dragging]: dragging,
						[styles.isWidthFull]: isWidthFull,
					})}
				>
					<Image alt='image upload' src={!!imageBase64 ? imageBase64 : path} fill className={styles.image} />
					<div className={styles.close} onClick={handleRemoveImg}>
						<IoClose color='#000' size={20} />
					</div>
				</div>
			) : (
				<label
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
					className={clsx(styles.main, {
						[styles.dragging]: dragging,
						[styles.isWidthFull]: isWidthFull,
					})}
					htmlFor={`file-work-${name}`}
				>
					<Image alt='Image empty' width={110} height={76} src={icons.upload} />
					<p>Kéo và thả tệp của bạn vào đây</p>
					<input
						hidden
						id={`file-work-${name}`}
						type='file'
						accept='image/png, image/jpeg, image/jpg'
						onChange={handleSelectImg}
						onClick={(e) => ((e.target as HTMLInputElement).value = '')}
					/>
				</label>
			)}
		</div>
	);
}

export default UploadImage;
