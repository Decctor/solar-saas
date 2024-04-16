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
