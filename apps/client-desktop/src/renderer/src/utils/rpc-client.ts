import { Client, RequestManager, WebSocketTransport } from "@open-rpc/client-js";
import { TypedEmitter } from "tiny-typed-emitter";

export type AriaAddUriOption = Partial<{
    "all-proxy": string
    "all-proxy-passwd": string
    "all-proxy-user": string
    "allow-overwrite": string
    "allow-piece-length-change": string
    "always-resume": string
    "async-dns": string
    "auto-file-renaming": string
    "bt-enable-hook-after-hash-check": string
    "bt-enable-lpd": string
    "bt-exclude-tracker": string
    "bt-external-ip": string
    "bt-force-encryption": string
    "bt-hash-check-seed": string
    "bt-load-saved-metadata": string
    "bt-max-peers": string
    "bt-metadata-only": string
    "bt-min-crypto-level": string
    "bt-prioritize-piece": string
    "bt-remove-unselected-file": string
    "bt-request-peer-speed-limit": string
    "bt-require-crypto": string
    "bt-save-metadata": string
    "bt-seed-unverified": string
    "bt-stop-timeout": string
    "bt-tracker": string
    "bt-tracker-connect-timeout": string
    "bt-tracker-interval": string
    "bt-tracker-timeout": string
    "check-integrity": string
    "checksum": string
    "conditional-get": string
    "connect-timeout": string
    "content-disposition-default-utf8": string
    "continue": string
    "dir": string
    "dry-run": string
    "enable-http-keep-alive": string
    "enable-http-pipelining": string
    "enable-mmap": string
    "enable-peer-exchange": string
    "file-allocation": string
    "follow-metalink": string
    "follow-torrent": string
    "force-save": string
    "ftp-passwd": string
    "ftp-pasv": string
    "ftp-proxy": string
    "ftp-proxy-passwd": string
    "ftp-proxy-user": string
    "ftp-reuse-connection": string
    "ftp-type": string
    "ftp-user": string
    "gid": string
    "hash-check-only": string
    "header": string
    "http-accept-gzip": string
    "http-auth-challenge": string
    "http-no-cache": string
    "http-passwd": string
    "http-proxy": string
    "http-proxy-passwd": string
    "http-proxy-user": string
    "http-user": string
    "https-proxy": string
    "https-proxy-passwd": string
    "https-proxy-user": string
    "index-out": string
    "lowest-speed-limit": string
    "max-connection-per-server": string
    "max-download-limit": string
    "max-file-not-found": string
    "max-mmap-limit": string
    "max-resume-failure-tries": string
    "max-tries": string
    "max-upload-limit": string
    "metalink-base-uri": string
    "metalink-enable-unique-protocol": string
    "metalink-language": string
    "metalink-location": string
    "metalink-os": string
    "metalink-preferred-protocol": string
    "metalink-version": string
    "min-split-size": string
    "no-file-allocation-limit": string
    "no-netrc": string
    "no-proxy": string
    "out": string
    "parameterized-uri": string
    "pause": string
    "pause-metadata": string
    "piece-length": string
    "proxy-method": string
    "realtime-chunk-checksum": string
    "referer": string
    "remote-time": string
    "remove-control-file": string
    "retry-wait": string
    "reuse-uri": string
    "rpc-save-upload-metadata": string
    "seed-ratio": string
    "seed-time": string
    "select-file": string
    "split": string
    "ssh-host-key-md": string
    "stream-piece-selector": string
    "timeout": string
    "uri-selector": string
    "use-head": string
    "user-agent": string
}>;

export type AriaStatusString = "active" | "waiting" | "paused" | "error" | "complete" | "removed";

export interface AriaStatus {
    completedLength: string
    connections: string
    dir: string
    downloadSpeed: string
    files: Array<{
        completedLength: string
        index: string
        length: string
        path: string
        selected: string
        uris: Array<{
            status: string
            uri: string
        }>
    }>
    gid: string
    numPieces: string
    pieceLength: string
    status: AriaStatusString
    totalLength: string
    uploadLength: string
    uploadSpeed: string
}

export type AriaClientEventFunction = (event: keyof AriaClientEvents, gid: string[]) => void;

export interface AriaClientEvents {
    "aria2.onDownloadStart": AriaClientEventFunction
    "aria2.onDownloadPause": AriaClientEventFunction
    "aria2.onDownloadStop": AriaClientEventFunction
    "aria2.onDownloadComplete": AriaClientEventFunction
    "aria2.onDownloadError": AriaClientEventFunction
    "aria2.onBtDownloadComplete": AriaClientEventFunction
}

export class AriaClient extends TypedEmitter<AriaClientEvents> {
    url: string;

    token: string;

    transport: WebSocketTransport;

    client: Client;

    static self: AriaClient;

    static getInstance() {
        if (!AriaClient.self) {
            console.log("正在创建 AriaClient 单例");
            AriaClient.self = new AriaClient(`ws://localhost:${window.electron.ipcRenderer.sendSync("aria2.getPort")}/jsonrpc`);
        }
        return AriaClient.self;
    }

    constructor(url: string) {
        super();
        this.url = url;
        this.token = "";
        this.transport = new WebSocketTransport(url);
        this.client = new Client(new RequestManager([this.transport]));
        this.client.onNotification((event) => {
            this.emit(
                event.method as keyof AriaClientEvents,
                event.method as keyof AriaClientEvents,
                (event.params as any[]).map((e) => e.gid),
            );
        });
    }

    /**
     * 查询下载列表
     * @param mode
     * @param offset
     */
    async tell(mode: string, offset: number[] = []): Promise<AriaStatus[]> {
        return this.client.request({
            method: `aria2.tell${mode}`,
            params: [`token:${this.token}`, ...offset],
        });
    }

    /**
     * 查询正在下载的列表
     */
    async tellActive() {
        return this.tell("Active");
    }

    /**
     * 添加下载链接
     * @param uri 链接
     * @param option 下载选项
     * @returns 下载项目的 gid
     */
    async addUri(uri: string, option: AriaAddUriOption = {}): Promise<string> {
        return this.client.request({
            method: "aria2.addUri",
            params: [`token:${this.token}`, [uri], option],
        });
    }

    /**
     * 获取单个文件的下载状态
     * @param gid 下载项目的 gid
     */
    async tellStatus(gid: string): Promise<AriaStatus> {
        return this.client.request({
            method: "aria2.tellStatus",
            params: [`token:${this.token}`, gid],
        });
    }

    /**
     * 删除下载项
     * @param gid 下载项目的 gid
     */
    async remove(gid: string): Promise<void> {
        await this.client.request({
            method: "aria2.remove",
            params: [`token:${this.token}`, gid],
        });
    }
}
