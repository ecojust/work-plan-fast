// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file;

use file::say_hello;

fn main() {
    //tauri_app_lib::run()
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![say_hello])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
