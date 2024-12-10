export interface BuildPaths {
    output: string;
    entry: string;
    html: string;
    public: string;
    src: string;
}

export type BuildMode = 'development' | 'production';
export type BuildPlatform = 'mobile' | 'desktop';

export interface BuildOptions {
    port: number;
    paths: BuildPaths;
    mode: BuildMode;
    platform: BuildPlatform;
    analyzer?: boolean;
}