import { forwardRef, useState } from 'react';
import images from '~/assets/images';
import styles from './Images.module.scss';
import classNames from 'classnames';

function Image({ src, alt, classnames, fallBack: customFallback = images.no_images, ...props }, ref) {
    const [fallBack, setFallBack] = useState();

    const handleError = () => {
        setFallBack(customFallback);
    };

    return (
        <img
            className={classNames(styles.wrapper, classnames)}
            ref={ref}
            src={fallBack || src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
}

export default forwardRef(Image);
