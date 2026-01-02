use base64::{engine::general_purpose::STANDARD, Engine};
use std::error::Error;
use std::fs;
use std::path::Path;

pub fn file_to_data_url<P: AsRef<Path>>(path: &P) -> Result<String, Box<dyn Error>> {
    let bytes = fs::read(path)?;
    let mime = file_to_mime(path)?;
    bin_to_data_url(&bytes, &mime)
}

pub fn bin_to_data_url(bytes: &Vec<u8>, mime: &str) -> Result<String, Box<dyn Error>> {
    let b64 = STANDARD.encode(&bytes);
    Ok(format!("data:{};base64,{}", mime, b64))
}

pub fn file_to_mime<P: AsRef<Path>>(path: &P) -> Result<String, Box<dyn Error>> {
    let mime = mime_guess::from_path(path).first_or_octet_stream();
    Ok(mime.as_ref().to_string())
}
