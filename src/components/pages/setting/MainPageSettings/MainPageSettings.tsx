import React, {useState} from 'react';

import {PropsMainPageSettings} from './interfaces';
import styles from './MainPageSettings.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Loading from '~/components/common/Loading';
import GridColumn from '~/components/layouts/GridColumn';
import settingsServices from '~/services/settingsServices';

function MainPageSettings({}: PropsMainPageSettings) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		urlIOS: string;
		urlAndroid: string;
	}>({
		urlIOS: '',
		urlAndroid: '',
	});

	useQuery([QUERY_KEY.detail_setting], {
		queryFn: () =>
			httpRequest({
				http: settingsServices.getURLDownloadApp({}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					urlIOS: data?.urlIOS || '',
					urlAndroid: data?.urlAndroid || '',
				});
			}
		},
	});

	const funcUpdateSetting = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật thành công!',
				http: settingsServices.updateURLDownloadApp({
					urlIOS: form.urlIOS,
					urlAndroid: form.urlAndroid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_setting]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSetting.isLoading} />
			<div className={styles.head_main}>
				<Breadcrumb titles={['Cài đặt hệ thống', 'Cập nhật']} listHref={[PATH.Settings]} />
				<div className={styles.group_button}>
					<Button p_10_24 aquamarine rounded_8 onClick={funcUpdateSetting.mutate}>
						Cập nhật
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<Form form={form} setForm={setForm}>
					<GridColumn col_2>
						<Input
							placeholder='Nhập link tải app IOS'
							name='urlIOS'
							type='text'
							value={form.urlIOS}
							label={
								<span>
									Link tải app IOS <span style={{color: '#EE0033'}}>*</span>
								</span>
							}
						/>
						<div>
							<Input
								placeholder='Nhập link tải app Android'
								name='urlAndroid'
								type='text'
								value={form.urlAndroid}
								label={
									<span>
										Link tải app Android <span style={{color: '#EE0033'}}>*</span>
									</span>
								}
							/>
						</div>
					</GridColumn>
				</Form>
			</div>
		</div>
	);
}

export default MainPageSettings;
