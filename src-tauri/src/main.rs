// Prevents additional console window on Windows in release, do not remove.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct RecentFiles {
    files: Vec<String>,
}

fn get_recent_files_path(app: &tauri::AppHandle) -> std::path::PathBuf {
    app.path().app_data_dir()
        .expect("Failed to get app data dir")
        .join("recent_files.json")
}

#[tauri::command]
fn get_recent_files(app: tauri::AppHandle) -> Vec<String> {
    let path = get_recent_files_path(&app);
    if !path.exists() {
        return Vec::new();
    }

    match fs::read_to_string(&path) {
        Ok(content) => serde_json::from_str::<RecentFiles>(&content)
            .map(|data| data.files)
            .unwrap_or_default(),
        Err(_) => Vec::new(),
    }
}

#[tauri::command]
fn add_recent_file(app: tauri::AppHandle, path: String) -> Result<(), String> {
    let recent_path = get_recent_files_path(&app);

    if let Some(parent) = recent_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let mut files = get_recent_files(app.clone());
    files.retain(|f| f != &path);
    files.insert(0, path);
    files.truncate(10);

    let json = serde_json::to_string_pretty(&RecentFiles { files })
        .map_err(|e| format!("Serialization error: {}", e))?;

    fs::write(&recent_path, json)
        .map_err(|e| format!("Write error: {}", e))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_recent_files, add_recent_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
