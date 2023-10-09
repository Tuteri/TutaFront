import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
// dayjs语言包
import "dayjs/locale/zh-cn"
import "dayjs/locale/ja"

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)


export function formatTime(data: any = new Date(), type = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(data * 1000).format(type)
}
export const getTimestamp = () => {
    return dayjs().unix()
}