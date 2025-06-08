/**
 * @author rgorai
 * @description calculate the difference in hours between 2 dates
 * @param dateA date object of the value to subtract from (newer date)
 * @param dateB date object of the value to subtract (older date)
 * @returns the number of hours to the nearest integer
 */
export const getDateHourDifference = (dateA: Date, dateB: Date): number => {
    if(!dateA  || !dateB){
        return 0
    }
    const diffInMs = Math.abs(Number(dateB) - Number(dateA));
    return Math.round(diffInMs / (1000 * 60 * 60));
};
export const getDateDayDifference = (dateA: Date, dateB: string): number | null => {
    if(!dateA  || !dateB){
        return 0
    }
    const dateBDate = new Date(dateB);

    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(dateBDate.getTime() - dateA.getTime());

    // Convert milliseconds to days
    const totalDays = diffInMs / (1000 * 60 * 60 * 24);

    return totalDays;
};

export const getDateMonthDifference = (dateA: Date, dateB: string): number => {
    const dateBMillis = dateB;
    const dateBDate = new Date(dateBMillis);

      const diffInMs = Math.abs(dateBDate.getTime() - dateA.getTime());
      
      const avgDaysInMonth = 30.44; // Approximate average number of days in a month
      const totalDays = diffInMs / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      const monthDifference = Math.round(totalDays / avgDaysInMonth);
      
      return monthDifference;
};


export const addDeltaToDate = (
    dateA: Date,
    delta: number,
    mode: string,
): Date => {
    const result = new Date(dateA);

    
    if (mode == 'w') {
        result.setDate(result.getDate() + delta * 7);
    } else if (mode == 'd') {
        result.setDate(result.getDate() + delta);
    }
    return result;
};

export const convertEpochToDate = (epoch: number): Date => {
    return new Date(epoch * 1000);
};

export const convertDateToEpoch = (date: Date): number => {
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
};