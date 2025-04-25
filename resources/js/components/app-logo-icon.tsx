import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/media/vypal.png" alt="vyPal's Logo" {...props} />;
}
