import { ITransformLeakOptions } from "../streams/TransformLeak";
export declare function viteResctrectedVariable({ restricted: { type, values }, }: ITransformLeakOptions): {
    name: string;
    configResolved(config: any): void;
};
