import React, {useState} from 'react';

import {PropsMainPagePrivacyPolicy} from './interfaces';
import styles from './MainPagePrivacyPolicy.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Form from '~/components/common/Form';
import EditerContent from '~/components/utils/EditerContent';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import policyServices from '~/services/policyServices';
import Loading from '~/components/common/Loading';

function MainPagePrivacyPolicy({}: PropsMainPagePrivacyPolicy) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		content: string;
	}>({
		content: '',
	});

	useQuery([QUERY_KEY.detail_policy], {
		queryFn: () =>
			httpRequest({
				http: policyServices.detailPolicy({}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					content: data?.content || '',
				});
			}
		},
	});

	const funcUpdatePolicy = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật chính sách thành công!',
				http: policyServices.upsertPolicy({
					content: form.content,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_policy]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdatePolicy.isLoading} />
			<div className={styles.head_main}>
				<Breadcrumb titles={['Chính sách bảo mật', 'Cập nhật']} listHref={[PATH.PrivacyPolicy]} />
				<div className={styles.group_button}>
					<Button disable={!form.content} p_10_24 aquamarine rounded_8 onClick={funcUpdatePolicy.mutate}>
						Cập nhật
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<Form form={form} setForm={setForm}>
					<EditerContent
						label={
							<span>
								Nội dung chính sách <span style={{color: 'red'}}>*</span>
							</span>
						}
						content={form.content}
						setContent={(c) =>
							setForm((prev) => ({
								...prev,
								content: typeof c === 'function' ? c(prev.content) : c,
							}))
						}
					/>
				</Form>
			</div>
		</div>
	);
}

export default MainPagePrivacyPolicy;
