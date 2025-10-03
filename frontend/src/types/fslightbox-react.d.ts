declare module 'fslightbox-react' {
  interface FsLightboxProps {
    toggler: boolean;
    sources: string[];
    slide?: number;
    type?: string;
    maxYoutubeVideoDimensions?: {
      width: number;
      height: number;
    };
  }

  const FsLightbox: React.FC<FsLightboxProps>;
  export default FsLightbox;
}