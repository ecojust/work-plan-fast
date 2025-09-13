import File from "./file";

export default class Rule {
  //不相连班次
  static async getNoLink() {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return [{ last: "D", now: "B" }];
    }
    const content = await File._readFile("./no-link.json", "[]");
    const data = JSON.parse(content?.data || "[]");
    return data;
  }

  static async setNoLink(rules: Array<any>) {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile(
      "./no-link.json",
      JSON.stringify(rules, null, 2)
    );
    return result;
  }

  //休息
  static async getRest() {
    //@ts-ignore
    if (process.env.NODE_ENV === "development") {
      return 8;
    }
    const content = await File._readFile("./rest.txt", "8");
    const data = parseInt(content?.data || "8");
    return data;
  }

  static async setRest(day: number) {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return;
    }
    const result = await File._writeFile("./rest.txt", day.toString());
    return result;
  }

  //不连续上班天数
  static async getMaxConsecutiveDays() {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return 6;
    }
    const content = await File._readFile("./continus.txt", "6");
    const data = content?.data || 6;
    return data;
  }
}
