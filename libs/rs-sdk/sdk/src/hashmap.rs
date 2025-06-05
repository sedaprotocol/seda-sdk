use std::{
    collections::HashMap as StdHashMap,
    hash::{BuildHasher, DefaultHasher},
};

pub struct DeterministicHasher {}

impl DeterministicHasher {
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for DeterministicHasher {
    fn default() -> Self {
        Self::new()
    }
}

impl BuildHasher for DeterministicHasher {
    type Hasher = DefaultHasher;

    fn build_hasher(&self) -> Self::Hasher {
        DefaultHasher::new()
    }
}

pub type HashMap<K, V> = StdHashMap<K, V, DeterministicHasher>;
