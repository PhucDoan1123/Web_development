import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AccountItems() {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/a187c4dfa896a5ea449a4c5d3927b20a~c5_100x100.jpeg?lk3s=a5d48078&nonce=64618&refresh_token=c45ebef8c8af0f7e41e165e76d7773d8&x-expires=1718373600&x-signature=Os%2BfrpsDt%2FSq6RlqiNQlG7jHVJM%3D&shp=a5d48078&shcp=81f88b70"
                alt="hoa"
            />
            <div className={cx('info')}>
                <p className={cx('name')}>
                    <span>Nguyen van A</span>
                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                </p>
                <span className={cx('username')}>nguyenvana</span>
            </div>
        </div>
    );
}

export default AccountItems;
