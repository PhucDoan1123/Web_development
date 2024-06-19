// Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import AccountItems from '~/components/AccountItem';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '~/components/Icons';

const cx = classNames.bind(styles);
function Search() {
    const [searchValues, setSearchValues] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState();

    const inputRef = useRef();

    useEffect(() => {
        if (!searchValues) {
            setSearchResult([]);
            return;
        }

        setLoading(true);

        fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURI(searchValues)}&type=less`)
            .then((res) => res.json())
            .then((res) => {
                setSearchResult(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [searchValues]);

    const handleClear = () => {
        setSearchValues('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    console.log(searchValues);
    return (
        <HeadlessTippy
            interactive
            visible={showResult && searchResult.length > 0}
            onClickOutside={handleHideResult}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex={'-1'} {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>

                        {searchResult.map((result) => (
                            <AccountItems key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValues}
                    placeholder="Search"
                    spellCheck={false}
                    onChange={(e) => setSearchValues(e.target.value)}
                    onFocus={() => setShowResult(true)}
                />

                {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                {!!searchValues && !loading && (
                    <button className={cx('clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faXmarkCircle} />
                    </button>
                )}
                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
