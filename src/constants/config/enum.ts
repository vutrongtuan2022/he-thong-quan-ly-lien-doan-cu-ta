export enum QUERY_KEY {
	table_user,
	table_card,
	table_news,
	table_videos,
	table_banners,
	table_admin,
	table_member,

	list_comment_news,

	detail_user,
	detail_card,
	detail_policy,
	detail_admin,
	detail_banners,
	detail_news,
	detail_video,
	detail_profile,
	detail_member,

	dropdown_category_role,
}

export enum GENDER {
	MALE,
	FEMALE,
}

export enum TYPE_NEWS {
	NEWS = 1,
	OPPORTUNITY,
	EVENT,
	DOCUMENT,
}

export enum TYPE_DISPLAY {
	PRIVATE,
	PUBLIC,
}

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LAST_7_DAYS = 8,
	LUA_CHON = 9,
}

export enum STATE_USER {
	REJECTED = 0, // Bị từ chối
	PENDING_APPROVAL, // Chờ duyệt
	APPROVED, // Đã duyệt
	PAID, // Đã đóng tiền
	ISSUED, // Đã phát hành thẻ cứng
}

export enum STATE_CARD {
	REJECTED = 0, // Bị từ chối
	PENDING_APPROVAL, // Chờ duyệt
	APPROVED, // Đã duyệt
	PAID, // Đã đóng tiền
	PENDING_ISSUED, // Chờ phát hành thẻ cứng
	ISSUED, // Đã phát hành thẻ cứng
}

export enum TYPE_EXPERTISE {
	ATHLETE = 1, // VĐV
	COACH, // HLV
	REFEREE, // Trọng tài
}

export enum TYPE_EDUCATION {
	HIGH_SCHOOL = 1, // THPT
	INTERMEDIATE, // Trung cấp
	COLLEGE, // Cao đẳng
	UNIVERSITY, // Đại học
	POSTGRADUATE, // Cao học
}

export enum CONFIG_STATUS {
	ACTIVE = 1, // Hoạt động
	LOCKED, // Bị khóa
}

export enum FEATURED_BLOG {
	OUTSTANDING = 1, // Nổi bật
	NOT_OUTSTANDING, // Không nổi bật
}

export enum ROLE_ADMIN {
	ADMIN = 'ADMIN',
	LEAGUE = 'LEAGUE',
}
