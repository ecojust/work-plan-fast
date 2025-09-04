import Lowdb from "./lowdb";

export default class Utils {
  static async getHolidays() {
    const allHolidays = await Lowdb.getData("holidays.json");
    const holidays = allHolidays.map((y: any) => y.holidays);
    const w1 = holidays.flat();

    const isReals = w1.filter((h: any) => h.isReal);

    return isReals.map((r: any) => r.date);
  }

  static getDatesBetween(startTime: string | number, endTime: string | number) {
    let currentDate = new Date(startTime);
    let endDate = new Date(endTime);
    let dates = [];
    while (currentDate.getTime() <= endDate.getTime()) {
      const day = Utils.getDate(currentDate.getTime());
      dates.push(day); // 克隆当前日期对象并格式化为 YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // 增加一天
    }
    return dates;
  }

  static calculateAllowance(
    startTime: string,
    endTime: string,
    holidays: any[] = []
  ) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const h = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (h < 10 && end.getHours() < 22) {
      return 0;
    }

    if (start.getHours() < 15 && end.getHours() >= 22) {
      return 100;
    }

    if (start.getHours() > 19 && h > 10) {
      const isHoliday = (date: Date) =>
        holidays.includes(date.toISOString().split("T")[0]);

      const segment1End = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      const segment2End = new Date(segment1End.getTime() + 8 * 60 * 60 * 1000);

      const segment1StartIsHoliday = isHoliday(start);
      const segment1EndIsHoliday = isHoliday(segment1End);
      const segment2StartIsHoliday = isHoliday(segment1End);
      const segment2EndIsHoliday = isHoliday(segment2End);

      if (
        !segment1StartIsHoliday &&
        !segment1EndIsHoliday &&
        !segment2StartIsHoliday &&
        !segment2EndIsHoliday
      ) {
        return 300;
      } else if (
        !segment1StartIsHoliday &&
        segment1EndIsHoliday &&
        segment2StartIsHoliday &&
        segment2EndIsHoliday
      ) {
        console.log("假期津贴---------------", 150);

        return 150;
      } else if (
        segment1StartIsHoliday &&
        segment1EndIsHoliday &&
        !segment2StartIsHoliday &&
        !segment2EndIsHoliday
      ) {
        console.log("假期津贴---------------", 150);

        return 150;
      } else {
        console.log("假期津贴---------------", 0);

        return 0;
      }
    }

    return 0;
  }

  // // Example usage:
  // const startTime = '2023-10-05T20:00:00';
  // const endTime = '2023-10-06T07:00:00';
  // const holidays = ['2023-10-05', '2023-10-06'];

  // console.log(calculateAllowance(startTime, endTime, holidays)); // Output: 300

  static updateOriginData(
    origin: any,
    date: string,
    user: string,
    starttime: string,
    endtime: string
  ) {
    const originData = origin.find((item: any) => item.date == date);
    if (originData) {
      const userData = originData.data.find((item: any) => item.name == user);
      if (userData) {
        userData.bardata[0].myBeginDate = starttime;
        userData.bardata[0].myEndDate = endtime;
      }
    }
  }

  static getRandomHexColor() {
    const letters = "BCDEF"; // 亮色系的字母范围
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }

    return color;
  }

  static getDate(
    date: string | number,
    offset: number = 0,
    returnformat: string = "full"
  ) {
    //date格式为 2024-05-01
    const currentDate = new Date(date);
    const nextDay = new Date(currentDate.getTime() + offset * 60 * 60 * 1000);

    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, "0");
    const day = String(nextDay.getDate()).padStart(2, "0");

    if (returnformat == "full") {
      return `${year}-${month}-${day}`;
    } else if (returnformat == "m-d") {
      return `${month}-${day}`;
    } else {
      return `${month}-${day}`;
    }
  }

  static clockCompare(a: string = "20:00", b: string = "08:00") {
    const fa = ~~a.replace(":", "");
    const fb = ~~b.replace(":", "");
    return fa < fb;
  }

  static getNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return {
      y: year,
      m: month,
      d: day,
      md: `${month}-${day}`,
    };
  }

  static formatTimeStamp(timestamp: number): string {
    //将时间戳转换为 2024-02-12 24:09 这种格式

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  static addHour(from: string = "2025-05-05 12:00", offset: number) {
    const f = new Date(from);
    const newDate = new Date(f.getTime() + offset * 1000 * 60 * 60);
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static getHour(from: string, to: string) {
    const f = new Date(from);
    const t = new Date(to);
    return (t.getTime() - f.getTime()) / (1000 * 60 * 60);
  }

  static generateNewTime(timestamp: number): string {
    const date = new Date(timestamp);
    const minutes = date.getUTCMinutes();

    if (minutes < 15) {
      date.setUTCMinutes(0);
    } else if (minutes < 45) {
      date.setUTCMinutes(30);
    } else {
      date.setUTCMinutes(0);
      date.setUTCHours(date.getUTCHours() + 1);
    }
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return Utils.formatTimeStamp(date.getTime());
  }
}
