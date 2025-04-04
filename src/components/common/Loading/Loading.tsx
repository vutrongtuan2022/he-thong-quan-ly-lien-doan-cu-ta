import {Fragment} from 'react';
import {PropsLoading} from './interfaces';
import styles from './Loading.module.scss';
import clsx from 'clsx';
import Portal from '../Portal';

function Loading({loading}: PropsLoading) {
	return (
		<Fragment>
			{loading ? (
				<Portal>
					<div className={styles.loading}>
						<div className={clsx(styles.loading_tri_circular, styles.center)}></div>
					</div>
				</Portal>
			) : null}
		</Fragment>
	);
}

export default Loading;
