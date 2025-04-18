import React, {useState} from 'react';

import {PropsFormRejectedCard} from './interfaces';
import styles from './FormRejectedCard.module.scss';
import {Danger} from 'iconsax-react';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormRejectedCard({uuidRejected, queryKeys, onClose}: PropsFormRejectedCard) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{rejectedReason: string}>({
		rejectedReason: '',
	});

	const funcRejectedUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Từ chối thành viên thành công!',
				http: userServices.rejectedCardUser({
					uuid: uuidRejected,
					rejectedReason: form?.rejectedReason,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	const handleSubmit = () => {
		if (!uuidRejected) {
			return toastWarn({
				msg: 'Không tìm thành viên!',
			});
		}

		return funcRejectedUser.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcRejectedUser.isLoading} />
			<div className={styles.container}>
				<Danger size='76' color='#F46161' variant='Bold' />
				<h4 className={styles.title}>Bạn có chắc chắn muốn từ chối yêu cầu</h4>
				<TextArea isRequired name='rejectedReason' max={5000} blur placeholder='Nhập lý do từ chối' />
				<div className={styles.groupBtn}>
					<Button grey_2 rounded_8 bold onClick={onClose} maxContent p_12_32 grey>
						Hủy bỏ
					</Button>
					<FormContext.Consumer>
						{({isDone}) => (
							<Button disable={!isDone} bold rounded_8 maxContent p_12_32 red>
								Xác nhận
							</Button>
						)}
					</FormContext.Consumer>
				</div>
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#8492A6' />
				</div>
			</div>
		</Form>
	);
}

export default FormRejectedCard;
