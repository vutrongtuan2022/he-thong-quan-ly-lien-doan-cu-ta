import {PATH} from '~/constants/config';
import {IDetailSetting, PropsMainPageSetting} from './interfaces';
import styles from './MainPageSettings.module.scss';
import Breadcrumb from '~/components/utils/Breadcrumb';
import {Fragment} from 'react';
import GridColumn from '~/components/layouts/GridColumn';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Button from '~/components/common/Button';
import settingsServices from '~/services/settingsServices';
function MainPageSettings({}: PropsMainPageSetting) {
	const {data: detatilSetting} = useQuery<IDetailSetting>([QUERY_KEY.detail_setting], {
		queryFn: () =>
			httpRequest({
				http: settingsServices.getURLDownloadApp({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.head_main}>
					<Breadcrumb titles={['Cài đặt hệ thống']} listHref={[PATH.Settings]} />
					<div className={styles.group_button}>
						<Button p_10_24 aquamarine rounded_8 href={`${PATH.UpdateSettings}`}>
							Chỉnh sửa
						</Button>
					</div>
				</div>
				<div className={styles.form_main}>
					<h4>Cài đặt hệ thống</h4>
					<div className={styles.group_info}>
						<div className={styles.divider}></div>
						<GridColumn col_2>
							<div className={styles.item}>
								<p>Link tải app IOS</p>
								<p>{detatilSetting?.urlIOS || ''}</p>
							</div>
							<div className={styles.item}>
								<p>Link tải app Android</p>
								<p>{detatilSetting?.urlAndroid || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default MainPageSettings;
