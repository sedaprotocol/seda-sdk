//! A deterministic [`HashMap`] for tally oracle programs without random hashing.
//!
//! The standard [`std::collections::HashMap`] relies on randomized seeds, which are disallowed in tally
//! oracle programs. This module provides [`DeterministicHasher`] and a [`HashMap`] alias
//! that guarantees consistent, reproducible hashes without any randomness.

use std::{
    collections::HashMap as StdHashMap,
    hash::{BuildHasher, DefaultHasher},
};

/// A hasher that always produces deterministic outputs by wrapping `DefaultHasher`.
pub struct DeterministicHasher {}

impl DeterministicHasher {
    /// Creates a new `DeterministicHasher`.
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for DeterministicHasher {
    /// Returns a default `DeterministicHasher`.
    fn default() -> Self {
        Self::new()
    }
}

impl BuildHasher for DeterministicHasher {
    type Hasher = DefaultHasher;

    /// Builds a new `DefaultHasher` for deterministic hashing.
    fn build_hasher(&self) -> Self::Hasher {
        DefaultHasher::new()
    }
}

/// A `HashMap` type alias using `DeterministicHasher` to ensure consistent hash values.
pub type HashMap<K, V> = StdHashMap<K, V, DeterministicHasher>;
