export interface BilisoundConfig {
    downloadPath: string
    muted: boolean
    autoPlay: boolean
    instantSave: boolean
    useAv: boolean
    theme: string
}

export interface BilisoundDownloadItem {
    /**
     * aria2 的 gid
     */
    gid: string
    /**
     * 文件展示名称
     */
    name: string
    /**
     * 文件下载日期（时间戳）
     */
    downloadAt: number
    /**
     * 文件下载结束日期（时间戳）
     */
    doneAt: number
    /**
     * 文件隶属 bv 号
     */
    videoId: string
    /**
     * 文件隶属分 P 号
     */
    videoEpisode: number
    /**
     * 文件存储路径
     */
    filePath: string
}

export interface BilisoundDownloadItemDisplay extends BilisoundDownloadItem {
    /**
     * 文件大小
     */
    fileSize: number
    /**
     * 文件已下载大小
     */
    fileSizeDone: number
    /**
     * 文件下载速度
     */
    speed: number
    /**
     * 文件下载状态
     */
    status:  "active" | "waiting" | "paused" | "error" | "complete" | "removed"
}
