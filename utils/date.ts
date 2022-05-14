import { format } from 'date-fns'

export const dateFormat = 'yyyyMMddHHmmss'
export const getDateNow = () => format(new Date(), dateFormat)
