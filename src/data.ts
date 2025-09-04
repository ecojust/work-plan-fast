import Utils from "./utils";

export default class Data {
  static async convertToGantt(
    originData: Array<any>,
    date: string = "2025-02-01"
  ) {
    //input
    // {
    //   "name": "cc",
    //   "startTime": "2025-03-01 12:00",
    //   "endTime": "2025-03-01 20:00"
    // },

    //output
    // {
    //   date: "2025-03-01",
    //   showBar: true,
    //   name: "juzisang",
    //   bardata: [
    //     {
    //       myBeginDate: "2025-02-28 20:00",
    //       myEndDate: "2025-03-01 08:00",
    //       ganttBarConfig: {
    //         id: "another-unique-id-1",
    //         hasHandles: true,
    //         style: {
    //           background: "#e09b69",
    //         },
    //       },
    //     },
    //   ],
    // },
    const holidays = await Utils.getHolidays();

    return originData.map((item) => {
      // const h = Utils.getHour(item.startTimeN, item.endTimeN);
      const allowance = Utils.calculateAllowance(
        item.startTimeN,
        item.endTimeN,
        holidays
      );

      let background = "#BBDEFB";
      if (allowance > 0) {
        background = "#FF9800";
      }
      if (allowance == 300) {
        background = "#E91E63";
      }
      // if (h < 4) {
      //   background = "#00ff00";
      // }

      const modify = {
        date: date,
        showBar: true,
        name: item.name,
        bardata: [
          {
            myBeginDate: item.startTimeN,
            myEndDate: item.endTimeN,
            allowance: allowance,
            ganttBarConfig: {
              id: `${item.name}`,
              // hasHandles: true,
              label: `${item.startTimeN.split(" ")[1]} - ${
                item.endTimeN.split(" ")[1]
              }`,
              style: {
                background: background,
                color: "black",
                borderRadius: "5px",
              },
            },
          },
        ],
      };
      return modify;
    });
  }
}
