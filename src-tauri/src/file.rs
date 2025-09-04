// use headless_chrome::Browser;
// use headless_chrome::LaunchOptionsBuilder;

// fn open_browser() -> Browser {
//     Browser::new(
//         LaunchOptionsBuilder::default()
//             .headless(true)
//             .build()
//             .unwrap(),
//     )
//     .unwrap()
// }

#[tauri::command]
pub fn say_hello(param: &str) -> String {
    let result;
    result = format!("Hello, {}! ", param);
    result
}
