import React, {Fragment} from 'react';

import {PropsStateActive} from './interfaces';
import styles from './StateActive.module.scss';
import clsx from 'clsx';

function StateActive({isBox = true, isSmall = false, stateActive, listState, borderRadius = 6}: PropsStateActive) {
	return (
		<Fragment>
			{isBox ? (
				<div
					style={{
						color: listState.find((v) => v.state == stateActive)?.textColor,
						background: listState.find((v) => v.state == stateActive)?.backgroundColor,
						borderRadius: `${borderRadius}px`,
					}}
					className={clsx(styles.container, {[styles.small]: isSmall})}
				>
					{listState.find((v) => v.state == stateActive)?.text || '---'}
				</div>
			) : (
				<div className={styles.main}>
					<div
						style={{
							background: listState.find((v) => v.state == stateActive)?.backgroundColor,
						}}
						className={styles.dot}
					></div>
					<p
						style={{
							color: listState.find((v) => v.state == stateActive)?.textColor,
						}}
					>
						{listState.find((v) => v.state == stateActive)?.text || '---'}
					</p>
				</div>
			)}
		</Fragment>
	);
}

export default StateActive;
