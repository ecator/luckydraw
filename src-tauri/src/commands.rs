use crate::avatar;
use crate::config::Config;
use crate::utils::{bin_to_data_url, file_to_data_url, get_execution_path};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

#[tauri::command]
pub fn get_config() -> Config {
    Config::new()
}

#[tauri::command]
pub fn get_avatars() -> Vec<avatar::Avatar> {
    avatar::get_avatars()
}

#[tauri::command]
pub fn get_lucky_list() -> Vec<String> {
    avatar::get_lucky_list()
}

#[tauri::command]
pub fn save_lucky_list(lucky_list: Vec<String>) {
    avatar::save_lucky_list(lucky_list)
}

#[tauri::command]
pub fn get_imgs() -> HashMap<String, String> {
    let mut imgs: HashMap<String, String> = HashMap::new();
    let mut img_path = get_execution_path().unwrap();
    img_path.push("img");
    let img_path = img_path.to_str().unwrap();
    let mime = "image/png";
    let mut default_bg = include_bytes!("../../img/bg.png").to_vec();
    let path: PathBuf = [img_path, "bg.png"].iter().collect();
    if Path::new(&path).exists() {
        default_bg = fs::read(&path).unwrap();
    }
    let mut default_title = include_bytes!("../../img/title.png").to_vec();
    let path: PathBuf = [img_path, "title.png"].iter().collect();
    if Path::new(&path).exists() {
        default_title = fs::read(&path).unwrap();
    }
    imgs.insert(
        "bg".to_string(),
        bin_to_data_url(&default_bg, mime).unwrap(),
    );
    imgs.insert(
        "title".to_string(),
        bin_to_data_url(&default_title, mime).unwrap(),
    );
    for i in 1..=9 {
        for t in vec!["bg", "title"] {
            let path: PathBuf = [img_path, format!("{}{}.png", t, i).as_str()]
                .iter()
                .collect();
            if Path::new(&path).exists() {
                imgs.insert(format!("{}{}", t, i), file_to_data_url(&path).unwrap());
            }
        }
    }

    imgs
}

#[tauri::command]
pub fn get_audios() -> HashMap<String, String> {
    let mut audios: HashMap<String, String> = HashMap::new();
    let mut audio_path = get_execution_path().unwrap();
    audio_path.push("audio");
    let audio_path = audio_path.to_str().unwrap();
    let mime = "audio/mp3";
    let mut default_bg = include_bytes!("../../audio/bg.mp3").to_vec();
    let path: PathBuf = [audio_path, "bg.mp3"].iter().collect();
    if Path::new(&path).exists() {
        default_bg = fs::read(&path).unwrap();
    }
    let mut default_active = include_bytes!("../../audio/active.mp3").to_vec();
    let path: PathBuf = [audio_path, "active.mp3"].iter().collect();
    if Path::new(&path).exists() {
        default_active = fs::read(&path).unwrap();
    }
    audios.insert(
        "bg".to_string(),
        bin_to_data_url(&default_bg, mime).unwrap(),
    );
    audios.insert(
        "active".to_string(),
        bin_to_data_url(&default_active, mime).unwrap(),
    );
    for i in 1..=9 {
        for t in vec!["bg", "active"] {
            let path: PathBuf = [audio_path, format!("{}{}.mp3", t, i).as_str()]
                .iter()
                .collect();
            if Path::new(&path).exists() {
                audios.insert(format!("{}{}", t, i), file_to_data_url(&path).unwrap());
            }
        }
    }

    audios
}

#[tauri::command]
pub async fn toggle_full_screen(webview_window: tauri::WebviewWindow) {
    let fullscreen = webview_window.is_fullscreen().unwrap();
    webview_window
        .set_fullscreen(!fullscreen)
        .unwrap_or_else(|e| {
            eprintln!("Failed to toggle fullscreen: {:?}", e);
        });
}
