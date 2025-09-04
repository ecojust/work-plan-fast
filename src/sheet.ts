import * as XLSX from "xlsx";

import Utils from "./utils";
import Lowdb from "./lowdb";

export default class Sheet {
  static parseSheet(sheetData: Array<any>, sheetName: string, year: string) {
    console.log("sheetName", sheetName);

    const dayRange = sheetName.split("-");
    const from = dayRange[0],
      to = dayRange[1];

    const dates = Utils.getDatesBetween(
      `${year}-${from.substring(0, 2)}-${from.substring(2)}`,
      `${year}-${to.substring(0, 2)}-${to.substring(2)}`
    );
    const keys = sheetData.find((item) => item.__rowNum__ === 2);
    let nameKey = "",
      timeKeys = [];
    for (var key in keys) {
      const label = keys[key];
      if (label == "姓名") {
        nameKey = key;
      }
      if (label == "班表") {
        timeKeys.push(key);
      }
    }

    // console.log(nameKey, timeKeys);

    const users = [];
    const dateMap = new Map();

    for (var i = 2; i < 29; i++) {
      //
      const row = sheetData[i];

      const userData: any = {
        name: row[nameKey],
        days: [],
      };

      timeKeys.forEach((timeKey, index) => {
        const raw = row[timeKey];
        const obj = {
          raw: raw,
          date: dates[index],
          endTime: "",
          startTime: "",
          endTimeN: "",
          startTimeN: "",
        };
        if (raw.length < 2) {
          //0
          Object.assign(obj, {
            startTime: `${obj.date} 12:00`,
            endTime: `${obj.date} 12:30`,
            startTimeN: `${obj.date} 12:00`,
            endTimeN: `${obj.date} 12:30`,
          });
        } else {
          //09:00-17:30/-4
          const timeRange = raw.split("/")[0].split("-");

          let startTime = timeRange[0];
          let endTime = timeRange[1];

          const offset = raw.split("/")[1];
          if (offset && offset.includes("+")) {
            endTime = Utils.addHour(
              `${obj.date} ${endTime}`,
              ~~offset.replace("+", "")
            );
          }

          let endDate = obj.date;

          if (!Utils.clockCompare(startTime, endTime)) {
            endDate = Utils.getDate(endDate, 24, "full");
          }

          Object.assign(obj, {
            startTime: `${obj.date} ${startTime}`,
            endTime: `${endDate} ${endTime}`,
            startTimeN: `${obj.date} ${startTime}`,
            endTimeN: `${endDate} ${endTime}`,
          });
        }

        if (!dateMap.has(obj.date)) {
          dateMap.set(obj.date, []);
        }

        dateMap.get(obj.date).push({
          name: userData.name,
          startTime: obj.startTime,
          endTime: obj.endTime,
          startTimeN: obj.startTimeN,
          endTimeN: obj.endTimeN,
          allowance: Utils.calculateAllowance(obj.startTimeN, obj.endTimeN),
        });

        //
        userData.days.push(obj);
      });
      //   console.log(row.__rowNum__, row);
      //   console.log("userData", userData);
      users.push(userData);
    }

    // for (var i = 0; i < 7; i++) {
    //   const day = dates[i];
    // }

    return {
      dateMap,
    };
  }

  static parseBook(book: any, year: string) {
    book.SheetNames.forEach((sheetName: string) => {
      if (sheetName.includes("-")) {
        const sheetData = XLSX.utils.sheet_to_json(book.Sheets[sheetName]);
        const { dateMap } = this.parseSheet(sheetData, sheetName, year);
        // console.log("dateMap", dateMap);

        [...dateMap.entries()].forEach(async (date) => {
          // console.log("date", date);

          const file = `${date[0]}.json`;
          const rows = date[1];
          // await Lowdb.clearData(file);
          await Lowdb.insertRows(file, rows);
        });
      }
    });
  }
}
