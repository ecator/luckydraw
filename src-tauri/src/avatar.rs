use crate::utils::{file_to_data_url, get_execution_path};
use image::imageops::FilterType;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Avatar {
    pub empno: String,
    pub data_url: String,
    pub data_url_thumbnail: String,
}

fn make_thumbnail<P: AsRef<Path>>(
    src_path: &P,
    dst_path: &P,
    max_side: u32,
) -> Result<(), Box<dyn std::error::Error>> {
    let img = image::open(src_path)?;
    let thumbnail = img.resize(max_side, max_side, FilterType::Lanczos3);
    thumbnail.save(dst_path)?;
    Ok(())
}

pub fn get_avatars() -> Vec<Avatar> {
    let mut avatars = Vec::new();
    let mut avatar_path = get_execution_path().unwrap();
    avatar_path.push("avatar");
    let mut thumb_path: PathBuf = avatar_path.clone();
    thumb_path.push("thumb");
    let Ok(entries) = fs::read_dir(avatar_path) else {
        return avatars;
    };
    if !Path::new(&thumb_path).exists() {
        fs::create_dir_all(&thumb_path).unwrap();
    }
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        if let Some(ext) = path.extension() {
            if ext.eq_ignore_ascii_case("jpg") || ext.eq_ignore_ascii_case("jpeg") {
                // 构造输出路径：保持子目录结构
                let file_name = path.file_name().unwrap();
                let basename = path.file_stem().unwrap();
                let mut thumb_file: PathBuf = thumb_path.clone();
                thumb_file.push(file_name);
                if !Path::new(&thumb_file).exists() {
                    make_thumbnail(&path, &thumb_file, 128).unwrap();
                }

                avatars.push(Avatar {
                    empno: basename.to_str().unwrap().to_string(),
                    data_url: file_to_data_url(&path).unwrap(),
                    data_url_thumbnail: file_to_data_url(&thumb_file).unwrap(),
                });
            }
        }
    }
    avatars
}
