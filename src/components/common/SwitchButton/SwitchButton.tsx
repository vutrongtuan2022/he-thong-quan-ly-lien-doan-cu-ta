import clsx from 'clsx';
import styles from './SwitchButton.module.scss';
import {PropsSwitchButton} from './interfaces';

function SwitchButton({checkOn, onClick}: PropsSwitchButton) {
	return (
		<div className={styles.main} onClick={() => onClick && onClick()}>
			<div className={clsx([styles.btn, {[styles.on]: checkOn}])}>
				<span className={clsx([styles.switch])}></span>
			</div>
		</div>
	);
}

export default SwitchButton;
