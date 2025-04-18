import React, {useState} from 'react';

import {IMemberDetail, PropsMainDetailMember} from './interfaces';
import styles from './MainDetailMember.module.scss';
import Button from '~/components/common/Button';
import StateActive from '~/components/utils/StateActive';
import Image from 'next/image';
import GridColumn from '~/components/layouts/GridColumn';
import {useRouter} from 'next/router';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, GENDER, QUERY_KEY, STATE_USER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Moment from 'react-moment';
import {listEducation, listExpertise} from '~/common/funcs/data';
import {getTextAddress} from '~/common/funcs/convertCoin';
import Popup from '~/components/common/Popup';
import Dialog from '~/components/common/Dialog';
import {Danger} from 'iconsax-react';

function MainDetailMember({onClose}: PropsMainDetailMember) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuidMember} = router.query;

	const {data: member} = useQuery<IMemberDetail>([QUERY_KEY.detail_member, _uuidMember], {
		queryFn: () =>
			httpRequest({
				http: userServices.detailUserAccount({
					uuid: _uuidMember as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuidMember,
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.info}>
					<h4>Chi tiết thành viên</h4>
					<div className={styles.status}>
						<p>Trạng thái thành viên hiện tại:</p>
						<StateActive
							isSmall={true}
							stateActive={member?.status!}
							listState={[
								{
									state: CONFIG_STATUS.ACTIVE,
									text: 'Hoạt động',
									backgroundColor: '#33C041',
									textColor: '#fff',
								},
								{
									state: CONFIG_STATUS.LOCKED,
									text: 'Đang khóa',
									backgroundColor: '#FD8B6E',
									textColor: '#fff',
								},
							]}
						/>
						<div className={styles.line}></div>
						<p>
							Ngày đăng ký:
							<span style={{marginLeft: '4px'}}>
								{member?.identityDate ? <Moment date={member?.identityDate} format='DD/MM/YYYY' /> : '---'}
							</span>
						</p>
					</div>
				</div>
				<div className={styles.group_btn}>
					{/* Chờ duyệt */}

					<Button grey p_8_24 rounded_8 onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.head_title}>
					<h4>Thông tin cá nhân</h4>
				</div>
				<div className={styles.group_info}>
					{member?.imageCardPath && (
						<Image
							alt='Avatar'
							src={`${process.env.NEXT_PUBLIC_IMAGE}/${member?.imageCardPath}`}
							width={80}
							height={80}
							className={styles.avatar}
						/>
					)}
					<GridColumn col_5>
						<div className={styles.item}>
							<p>Họ và tên</p>
							<p>{member?.fullname}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày sinh</p>
							<p>
								<Moment date={member?.birthday} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Giới tính</p>
							<p>
								{member?.gender == GENDER?.MALE && 'Nam'}
								{member?.gender == GENDER?.FEMALE && 'Nữ'}
							</p>
						</div>
						<div className={styles.item}>
							<p>Chiều cao (cm)</p>
							<p>{member?.height || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Cân nặng (kg)</p>
							<p>{member?.weight || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Tình trạng học vấn</p>
							<p>{listEducation?.find((v) => v?.value == member?.education)?.name}</p>
						</div>
						<div className={styles.item}>
							<p>Chức vụ</p>
							<p>{listExpertise?.find((v) => v?.value == member?.expertiseType)?.name || '---'}</p>
						</div>
						<div className={styles.item}>
							<p>Số điện thoại liên lạc</p>
							<p>{member?.phoneNumber}</p>
						</div>
						<div className={styles.item}>
							<p>Email</p>
							<p>{member?.email}</p>
						</div>
					</GridColumn>
				</div>
				<div className={styles.line_width}></div>
				<div className={styles.head_title}>
					<h4>Địa chỉ</h4>
				</div>
				<div className={styles.group_info}>
					<div className={styles.item}>
						<p>{getTextAddress(member?.addressInfo)}</p>
					</div>
				</div>
				<div className={styles.line_width}></div>
				<div className={styles.head_title}>
					<h4>Thông tin CMND/CCCD</h4>
				</div>
				<div className={styles.group_info}>
					<GridColumn col_3>
						<div className={styles.item}>
							<p>Số CMND/CCCD</p>
							<p>{member?.identityCode}</p>
						</div>
						<div className={styles.item}>
							<p>Nơi cấp CMND/CCCD</p>
							<p>{member?.identityPlace}</p>
						</div>
						<div className={styles.item}>
							<p>Ngày cấp CMND/CCCD</p>
							<p>
								<Moment date={member?.identityDate} format='DD/MM/YYYY' />
							</p>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt trước CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt trước'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${member?.frontIdentityPath}`}
								height={216}
								width={368}
								style={{borderRadius: '8px'}}
							/>
						</div>
						<div className={styles.item}>
							<p>Ảnh mặt sau CMND/CCCD</p>
							<Image
								alt='Ảnh CCCD mặt sau'
								src={`${process?.env?.NEXT_PUBLIC_IMAGE}/${member?.backIdentityPath}`}
								height={216}
								width={368}
								style={{borderRadius: '8px'}}
							/>
						</div>
					</GridColumn>
				</div>
			</div>
		</div>
	);
}

export default MainDetailMember;
