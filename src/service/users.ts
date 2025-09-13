import File from "./file";

export default class User {
  static async getUsers() {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return [{ name: "张三", desc: "First user" }];
    }
    const content = await File._readFile("./users.json", "[]");
    const users = JSON.parse(content?.data || "[]");
    if (users.length == 0) {
      return [{ name: "张三", desc: "First user" }];
    }
    return users;
  }

  static async setUsers(users: Array<any>) {
    //@ts-ignore

    if (process.env.NODE_ENV === "development") {
      return;
    }
    // 这里可以添加保存用户数据的逻辑
    const result = await File._writeFile(
      "./users.json",
      JSON.stringify(users, null, 2)
    );
    return result;
  }
}
