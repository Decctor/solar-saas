import dayjs from 'dayjs'
// @ts-ignore
import dayjsBusinessDays from 'dayjs-business-days'

dayjs.extend(dayjsBusinessDays)

export function getMonthPeriodsStrings({ initialYear, endYear }: { initialYear: number; endYear: number }) {
  var iteratingYear = initialYear

  var periods: string[] = []
  for (let i = 1; i <= 12; i++) {
    const str = i < 10 ? `0${i}/${iteratingYear}` : `${i}/${iteratingYear}`

    periods.push(str)

    // Resetting month and adding up a year
    if (i == 12) {
      // If iterating year is end year and the month is 12, stop iteration
      if (iteratingYear == endYear) break
      iteratingYear += 1
      i = 0
    }
  }
  return periods
}

export function getHoursDiff({ start, finish, businessOnly }: { start: string; finish: string; businessOnly?: boolean }) {
  // if (businessOnly) {
  //   // @ts-ignore
  //   const hourDiff = dayjs(finish).businessDiff(dayjs(start), 'hour')
  //   return hourDiff
  // }
  const hourDiff = dayjs(finish).diff(dayjs(start), 'hour')
  return hourDiff
}
