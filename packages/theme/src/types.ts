export interface BilisoundTheme {
    (): Record<string, any>

    /**
     * 主题名称
     */
    themeName: string
    /**
     * 主题在选择列表中的排序（升序）
     */
    order: number
}
