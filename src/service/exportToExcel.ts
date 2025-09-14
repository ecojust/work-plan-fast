import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { nextTick } from "vue";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";

// when using `"withGlobalTauri": true`, you may use
// const { save } = window.__TAURI__.dialog;

export interface IExportXlsx {
  eleById: string;
  title: string;
}

const exportToExcel = async (
  element: string | Array<IExportXlsx>,
  name?: string
): Promise<Object> => {
  await nextTick();
  // 设置导出的内容是否只做解析，不进行格式转换 false：要解析， true:不解析
  const xlsxParam = { raw: false };
  let wb: XLSX.WorkBook;
  if (typeof element === "string") {
    // 导出单个表格
    wb = XLSX.utils.table_to_book(document.getElementById(element), xlsxParam);
  } else {
    // 遍历导出多个表格
    wb = XLSX.utils.book_new();
    element.forEach((item: IExportXlsx) =>
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.table_to_sheet(
          document.getElementById(item.eleById),
          xlsxParam
        ),
        item.title
      )
    );
  }

  // 下载保存文件
  // FileSaver.saveAs(
  //   new Blob([wbout], {
  //     type: "application/octet-stream",
  //   }),
  //   fileName
  // );
  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "buffer",
  });
  try {
    //1.系统弹窗导出到文件夹，二进制文件

    const path = await save({
      filters: [
        {
          name: "My Filter",
          extensions: ["xlsx"],
        },
      ],
    });
    if (path) {
      await writeFile(path, wbout, {});
    }
  } catch (e) {
    console.log("error", e);
  }

  return wbout;
};
export default exportToExcel;
