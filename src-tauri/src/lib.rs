mod avatar;
mod commands;
mod config;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_config,
            commands::get_avatars,
            commands::get_lucky_list,
            commands::save_lucky_list,
            commands::get_imgs,
            commands::get_audios,
            commands::toggle_full_screen
        ])
        .run(tauri::generate_context!())
        .expect("error while running LuckyDraw application");
}
