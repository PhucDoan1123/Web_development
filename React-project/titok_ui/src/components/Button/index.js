import React from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    small = false,
    large = false,
    disabled = false,
    rounded = false,
    rightIcon,
    leftIcon,
    children,
    className,
    onClick,
    ...passProps
}) {
    let Comp = 'button';

    const componentProps = {
        onClick,
        ...passProps,
    };

    //Remove event listener when btn is disabled
    if (disabled) {
        Object.keys(componentProps).forEach((key) => {
            if (key.startsWith('on') && typeof componentProps[key] === 'function') {
                delete componentProps[key];
            }
        });
    }

    if (to) {
        componentProps.to = to;
        Comp = Link;
    } else if (href) {
        componentProps.href = href;
        Comp = 'a';
    }

    const classes = cx('wrapper', {
        // Custom rieng cho 1 button
        [className]: className,
        primary,
        outline,
        small,
        large,
        text,
        disabled,
        rounded,
    });

    return (
        <Comp className={classes} {...componentProps}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}{' '}
        </Comp>
    );
}

export default Button;
