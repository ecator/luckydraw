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
    let Ok(entries) = fs::read_dir(&avatar_path) else {
        return avatars;
    };
    let mut thumb_path_small: PathBuf = avatar_path.clone();
    thumb_path_small.push("small");
    if !Path::new(&thumb_path_small).exists() {
        fs::create_dir_all(&thumb_path_small).unwrap();
    }
    let mut thumb_path_normal: PathBuf = avatar_path.clone();
    thumb_path_normal.push("normal");
    if !Path::new(&thumb_path_normal).exists() {
        fs::create_dir_all(&thumb_path_normal).unwrap();
    }
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        if let Some(ext) = path.extension() {
            if ext.eq_ignore_ascii_case("jpg") || ext.eq_ignore_ascii_case("jpeg") {
                let modified = path.metadata().unwrap().modified().unwrap();
                // 构造输出路径：保持子目录结构
                let file_name = path.file_name().unwrap();
                let basename = path.file_stem().unwrap();
                let mut thumb_file_small: PathBuf = thumb_path_small.clone();
                thumb_file_small.push(file_name);
                if !thumb_file_small.exists()
                    || modified > thumb_file_small.metadata().unwrap().modified().unwrap()
                {
                    make_thumbnail(&path, &thumb_file_small, 128).unwrap();
                }
                let mut thumb_file_normal: PathBuf = thumb_path_normal.clone();
                thumb_file_normal.push(file_name);
                if !thumb_file_normal.exists()
                    || modified > thumb_file_normal.metadata().unwrap().modified().unwrap()
                {
                    make_thumbnail(&path, &thumb_file_normal, 512).unwrap();
                }

                avatars.push(Avatar {
                    empno: basename.to_str().unwrap().to_string(),
                    data_url: file_to_data_url(&thumb_file_normal).unwrap(),
                    data_url_thumbnail: file_to_data_url(&thumb_file_small).unwrap(),
                });
            }
        }
    }
    avatars
}
