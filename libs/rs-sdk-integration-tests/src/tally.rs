use seda_sdk_rs::{get_reveals, get_unfiltered_reveals, hashmap::HashMap, process::Process};
use std::collections::HashMap as StdHashMap;

pub fn test_tally_vm_reveals() {
    let reveals = get_unfiltered_reveals();
    match reveals {
        Ok(reveals) => {
            let reveals_bytes = serde_json::to_vec(&reveals).unwrap();
            Process::success(&reveals_bytes);
        }
        Err(e) => {
            Process::error(e.to_string().as_bytes());
        }
    }
}

pub fn test_tally_vm_reveals_filtered() {
    let reveals = get_reveals().unwrap();
    let reveals_bytes = serde_json::to_vec(&reveals).unwrap();

    Process::success(&reveals_bytes);
}

pub fn test_tally_hashmap() {
    let mut map = StdHashMap::<String, String>::default();
    map.insert("key".to_string(), "value".to_string());
    let reveals_bytes = serde_json::to_vec(&map).unwrap();

    Process::success(&reveals_bytes);
}

pub fn test_tally_deterministic_hashmap() {
    let mut map = HashMap::<String, String>::default();
    map.insert("key".to_string(), "value".to_string());
    let reveals_bytes = serde_json::to_vec(&map).unwrap();

    Process::success(&reveals_bytes);
}
