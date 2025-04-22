import React, {useState} from 'react';
import styles from './FormCreateExpertise.module.scss';
import {IFormCreateExpertise, PropsFormCreateExpertise} from './interfaces';
import Form, {FormContext, Input} from '~/components/common/Form';
import {QUERY_KEY, STATE_CARD, TYPE_EXPERTISE} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Loading from '~/components/common/Loading';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import {listExpertise} from '~/common/funcs/data';
function FormCreateExpertise({uuid, onClose, queryKeys}: PropsFormCreateExpertise) {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<IFormCreateExpertise>({fullname: '', expertiseType: null});

	useQuery([QUERY_KEY.detail_member], {
		queryFn: () =>
			httpRequest({
				http: userServices.detailUpdateExpertiseType({
					uuid: uuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({fullname: data?.fullname || '', expertiseType: data?.expertiseType || null});
			}
		},
		enabled: !!uuid,
	});

	const funcCreateExpertise = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới chức vụ thành công!',
				http: userServices.updateExpertiseType({
					uuid: uuid,
					expertiseType: form?.expertiseType || null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					fullname: '',
					expertiseType: TYPE_EXPERTISE.ATHLETE,
				});
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	const handleSubmit = async () => {
		return funcCreateExpertise.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcCreateExpertise.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Thêm chức vụ</h4>

				<div className={styles.line}></div>
				<div className={styles.form}>
					<Input
						placeholder='Nhập họ tên'
						name='fullname'
						type='text'
						value={form.fullname}
						isRequired
						readOnly
						max={255}
						label={
							<span>
								Họ tên <span style={{color: '#EE0033'}}>*</span>
							</span>
						}
					/>

					<div className={styles.mt}>
						<Select
							isSearch
							name='expertiseType'
							value={form.expertiseType}
							placeholder='Chọn'
							label={
								<span>
									Chức vụ <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listExpertise?.map((v: any) => (
								<Option
									key={v?.value}
									title={v?.name}
									value={v?.value}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											expertiseType: v?.value,
										}))
									}
								/>
							))}
						</Select>
					</div>

					<div className={styles.group_button}>
						<div>
							<Button p_10_14 white rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>

						<FormContext.Consumer>
							{({isDone}) => (
								<div>
									<Button disable={!isDone} p_10_14 aquamarine rounded_6>
										Lưu lại
									</Button>
								</div>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#9EA5C0' />
				</div>
			</div>
		</Form>
	);
}

export default FormCreateExpertise;
