use dotenvy::{dotenv_override, from_read};
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;
use std::io::Cursor;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct Config {
    pub lucky_key: String,
    pub lucky_init_key: String,
    pub clear_key: String,
    pub full_screen_key: String,
    pub lucky_times: Vec<u32>,
    pub lucky_speeds: Vec<f64>,
}

const DEFULT_CONFIG: &str = include_str!("../../.env.example");
impl Config {
    pub fn new() -> Self {
        from_read(Cursor::new(DEFULT_CONFIG)).ok();
        dotenv_override().ok();
        let lucky_key = env::var("LUCKY_KEY").unwrap();
        let lucky_init_key = env::var("LUCKY_INIT_KEY").unwrap();
        let clear_key = env::var("CLEAR_KEY").unwrap();
        let full_screen_key = env::var("FULL_SCREEN_KEY").unwrap();
        let lucky_times = env::var("LUCKY_TIMES").unwrap();
        let lucky_times: Vec<u32> = serde_json::from_str(&lucky_times).unwrap();
        let lucky_speeds = env::var("LUCKY_SPEEDS").unwrap();
        let lucky_speeds: Vec<f64> = serde_json::from_str(&lucky_speeds).unwrap();
        Self {
            lucky_key,
            lucky_init_key,
            clear_key,
            full_screen_key,
            lucky_times,
            lucky_speeds,
        }
    }
}
