//! Process management utilities for the SDK.
//!
//! This module provides functionality for handling program arguments, environment variables,
//! and process termination with specific exit codes and results.
//!
//! # Examples
//!
//! ```no_run
//! use seda_sdk::process::Process;
//!
//! // Handle success case
//! let result = vec![1, 2, 3];
//! Process::success(&result);
//!
//! // Handle error case with message
//! Process::exit_with_message(1, "Operation failed");
//! ```

use std::{
    collections::BTreeMap,
    env::{self},
    process,
};

use crate::{
    raw::{self},
    vm_modes::{DR_REPLICATION_FACTOR_ENV_KEY, VM_MODE_DR, VM_MODE_ENV_KEY, VM_MODE_TALLY},
};

/// Utilities for managing process-level operations.
pub struct Process;

impl Process {
    /// Returns a vector of command-line arguments passed to the program.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let args = Process::args();
    /// // args[0] is the program name
    /// // args[1] would be the first argument
    /// ```
    pub fn args() -> Vec<String> {
        env::args().collect()
    }

    /// Returns a map of all environment variables.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let env_vars = Process::envs();
    /// for (key, value) in env_vars {
    ///     println!("{}: {}", key, value);
    /// }
    /// ```
    pub fn envs() -> BTreeMap<String, String> {
        env::vars().collect()
    }

    /// Retrieves and decodes the data request inputs
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let input_bytes = Process::get_inputs();
    /// // Process the input bytes...
    /// ```
    pub fn get_inputs() -> Vec<u8> {
        // 1 is inputs because 0 is name of the program
        let args = Self::args();
        let raw_input = args.get(1).expect("Arg at index 1 must best set");

        hex::decode(raw_input).expect("Arg at index 1 is not a valid hex string")
    }

    /// Gets the VM mode from environment variables.
    fn get_vm_mode() -> String {
        env::var(VM_MODE_ENV_KEY).expect("VM_MODE is not set in environment")
    }

    /// Checks if the current VM mode is set to tally mode.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// if Process::is_tally_vm_mode() {
    ///     // Handle tally mode specific logic
    /// }
    /// ```
    pub fn is_tally_vm_mode() -> bool {
        Self::get_vm_mode() == VM_MODE_TALLY
    }

    /// Checks if the current VM mode is set to DR mode.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// if Process::is_dr_vm_mode() {
    ///     let replication = Process::replication_factor();
    ///     // Handle DR mode specific logic
    /// }
    /// ```
    pub fn is_dr_vm_mode() -> bool {
        Self::get_vm_mode() == VM_MODE_DR
    }

    /// Exits the process successfully (code 0) with the given result.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let result = vec![0x01, 0x02, 0x03];
    /// Process::success(&result);
    /// ```
    pub fn success(result: &[u8]) {
        Self::exit_with_result(0, result);
    }

    /// Exits the process with an error (code 1) and the given result.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let error_data = vec![0xFF];
    /// Process::error(&error_data);
    /// ```
    pub fn error(result: &[u8]) {
        Self::exit_with_result(1, result);
    }

    /// Gets the replication factor for the data request
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// if Process::is_dr_vm_mode() {
    ///     let factor = Process::replication_factor();
    ///     println!("Replication factor: {}", factor);
    /// }
    /// ```
    pub fn replication_factor() -> u16 {
        let variable = env::var(DR_REPLICATION_FACTOR_ENV_KEY).unwrap_or_else(|_| {
            panic!("{DR_REPLICATION_FACTOR_ENV_KEY} is not set in environment")
        });

        variable
            .parse()
            .unwrap_or_else(|_| panic!("{DR_REPLICATION_FACTOR_ENV_KEY} must be a valid u16"))
    }

    /// Exits the process with the given code and message.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// // Exit with an error message
    /// Process::exit_with_message(1, "Operation failed: invalid input");
    ///
    /// // Exit with success message
    /// Process::exit_with_message(0, "Operation completed successfully");
    /// ```
    pub fn exit_with_message(code: u8, message: &str) {
        let message_encoded = message.as_bytes();
        Self::exit_with_result(code, message_encoded);
    }

    /// Exits the process with the given code and result bytes.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// let result = vec![1, 2, 3, 4];
    /// Process::exit_with_result(0, &result);
    /// ```
    pub fn exit_with_result(code: u8, result: &[u8]) {
        unsafe { raw::execution_result(result.as_ptr(), result.len() as u32) };
        process::exit(code.into());
    }

    /// Exits the process with the given code and an empty result.
    ///
    /// # Examples
    ///
    /// ```no_run
    /// use seda_sdk::process::Process;
    ///
    /// // Exit successfully with no result
    /// Process::exit(0);
    ///
    /// // Exit with error code
    /// Process::exit(1);
    /// ```
    pub fn exit(code: u8) {
        Self::exit_with_result(code, &[]);
    }
}
