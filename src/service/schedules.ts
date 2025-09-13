import File from "./file";

export default class Schedule {
  static async getSchedules() {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return [
        { label: "休假", value: "vacation", color: "#dbdbdb" },
        { label: "7:00-15:00", value: "B", color: "#1890ff" },
        { label: "10:00-18:00", value: "C", color: "#00ff00" },
        { label: "14:00-22:00", value: "D", color: "red" },
      ];
    }

    const content = await File._readFile("./schedules.json", "[]");
    let schedules = JSON.parse(content?.data || "[]");

    if (schedules.length == 0) {
      schedules = [{ label: "休假", value: "vacation", color: "#dbdbdb" }];
    }
    return schedules;
  }

  static async setSchedules(schedules: Array<any>) {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile(
      "./schedules.json",
      JSON.stringify(schedules, null, 2)
    );
    return result;
  }
}
