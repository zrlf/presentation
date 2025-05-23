import React from "react";
type ImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    /** The image URL injected by our remark plugin */
    src: string;
    caption?: string;
    containerClass?: string;
    fillHeight?: boolean;
};
export default function Img({ src, caption, containerClass, fillHeight, ...rest }: ImgProps): import("react/jsx-runtime").JSX.Element;
declare const ImgHTML: (props: any) => import("react/jsx-runtime").JSX.Element;
declare const ImageRow: (props: any) => import("react/jsx-runtime").JSX.Element;
export { Img, ImgHTML, ImageRow };
//# sourceMappingURL=Img.d.ts.map