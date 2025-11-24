/**
 * 生成当前时间戳
 */
export function getCurrentTimestamp(): number {
    return Date.now();
}

/**
 * 根据时间戳生成时间字符串
 * @param timestamp 时间戳
 */
export function toTimeString(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${hours}${minutes}${seconds}.${milliseconds}`;
}
