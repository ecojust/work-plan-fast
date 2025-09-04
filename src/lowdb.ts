import { create, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { resolveResource } from "@tauri-apps/api/path";

interface IRow {
  name: string;
  startTime: string;
  endTime: string;
}

export default class Lowdb {
  static async clearData(file: string) {
    await this.writeFile(file, "");
  }

  static async getData(file: string) {
    const data = await this.readFile(file);
    try {
      const parseData = JSON.parse(data);
      return parseData;
    } catch (error) {
      return [];
    }
  }

  static async updateRow(file: string, row: IRow) {
    const data = await this.readFile(file);
    try {
      const parseData = JSON.parse(data);
      const find = parseData.find((item: IRow) => item.name == row.name);
      if (find) {
        Object.assign(find, row);
      }
      await this.writeFile(file, JSON.stringify(parseData));
    } catch (error) {
      await this.writeFile(file, JSON.stringify(`[${JSON.stringify(row)}]`));
    }
  }

  static async insertRows(file: string, rows: Array<IRow>) {
    const data = await this.readFile(file);
    try {
      let parseData = JSON.parse(data);

      rows.forEach((row) => {
        const find = parseData.find((item: IRow) => item.name == row?.name);
        if (find) {
          Object.assign(find, row);
        } else {
          parseData.push(row);
        }
      });
      console.log("insertRows", parseData);
      // parseData = parseData.concat(rows);
      await this.writeFile(file, JSON.stringify(parseData));
    } catch (error) {
      console.log("rows", rows);

      await this.writeFile(file, JSON.stringify(rows));
    }
  }

  static async insertRow(file: string, row: Object) {
    const data = await this.readFile(file);

    try {
      const parseData = JSON.parse(data);
      parseData.push(row);
      await this.writeFile(file, JSON.stringify(parseData));
    } catch (error) {
      await this.writeFile(file, `[${JSON.stringify(row)}]`);
    }
  }

  static async writeFile(file: string, content: string) {
    // console.time("writeFile");
    const path = await resolveResource(file);
    try {
      await writeFile(path, new TextEncoder().encode(content));
    } catch (error) {
      await create(path);
      await writeFile(path, new TextEncoder().encode(content));
    } finally {
      // console.timeEnd("writeFile");
    }
  }

  static async readFile(file: string): Promise<string> {
    // console.time("readFile");
    const path = await resolveResource(file);
    let content = "";
    try {
      content = new TextDecoder("utf-8").decode(await readFile(path));
    } catch (error) {
      await create(path);
    } finally {
      // console.timeEnd("readFile");
      return content;
    }
  }
}
