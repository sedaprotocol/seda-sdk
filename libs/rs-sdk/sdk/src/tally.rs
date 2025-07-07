//! This module provides functionality to retrieve and process reveals from the command line arguments
//! of a data request report in the Seda runtime SDK.
//!
//! It defines the [`RevealBody`] and [`RevealResult`] structs to represent the reveal data,
//! and provides functions to retrieve unfiltered reveals and filtered reveals that are in consensus
//! via the functions [`get_unfiltered_reveals`] and [`get_reveals`], respectively.

use anyhow::{Error, Result};
use serde::{Deserialize, Serialize};

use crate::Process;

const REVEALS_ARGUMENT_POSITION: usize = 2;
const CONSENSUS_ARGUMENT_POSITION: usize = 3;

/// Represents the body of a reveal body of a data request report.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RevealBody {
    /// The block height the data request was posted.
    pub dr_block_height: u64,
    /// The exit code of the data request's execution VM.
    pub exit_code: u8,
    /// The gas used by the data request's execution VM.
    pub gas_used: u64,
    /// The data returned by the data request's execution VM.
    pub reveal: Vec<u8>,
}

/// Represents a reveal body of a data request report.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RevealResult {
    /// The body of the reveal.
    pub body: RevealBody,
    /// Whether the reveal is in consensus or not.
    pub in_consensus: bool,
}

/// Retrieves the unfiltered reveals from the command line arguments.
///
/// # Errors
///
/// This function will return an error if:
/// - The expected arguments are not found in the command line arguments.
/// - The number of reveals does not match the number of consensus reports.
/// - The JSON deserialization fails for either the reveals or the consensus reports.
///
/// # Examples
///
/// ```no_run
/// use seda_sdk_rs::get_unfiltered_reveals;
/// match get_unfiltered_reveals() {
///     Ok(reveals) => {
///        for reveal in reveals {
///            // Process each reveal
///        }
///     },
///     Err(err) => {
///         eprintln!("Error retrieving unfiltered reveals: {}", err);
///     }
/// }
/// ```
pub fn get_unfiltered_reveals() -> Result<Vec<RevealResult>> {
    let args = Process::args();

    let encoded_reveals = args
        .get(REVEALS_ARGUMENT_POSITION)
        .ok_or(Error::msg(format!("Expected argument at {REVEALS_ARGUMENT_POSITION}",)))?;

    let encoded_consensus = args.get(CONSENSUS_ARGUMENT_POSITION).ok_or(Error::msg(format!(
        "Expected argument at {CONSENSUS_ARGUMENT_POSITION}"
    )))?;

    let reveals: Vec<RevealBody> = serde_json::from_str(encoded_reveals)?;
    let consensus: Vec<u8> = serde_json::from_str(encoded_consensus)?;

    if reveals.len() != consensus.len() {
        return Err(Error::msg(format!(
            "Number of reveals ({}) does not equal number of consensus reports ({}).",
            reveals.len(),
            consensus.len()
        )));
    }

    let mut reveal_results: Vec<RevealResult> = Vec::new();

    for (index, reveal) in reveals.iter().enumerate() {
        let consensus_info = consensus
            .get(index)
            .ok_or(Error::msg("Unreachable, could not find index"))?;

        reveal_results.push(RevealResult {
            body: reveal.clone(),
            in_consensus: *consensus_info == 0,
        });
    }

    Ok(reveal_results)
}

/// Retrieves the reveals that are in consensus from the command line arguments.
///
/// # Errors
/// This function will return an error if the unfiltered reveals cannot be retrieved see [`get_unfiltered_reveals`]
/// for more information.
///
/// # Examples
/// ```no_run
/// use seda_sdk_rs::get_reveals;
/// match get_reveals() {
///    Ok(reveals) => {
///       for reveal in reveals {
///           // Process each reveal that is in consensus
///       }
///   },
///   Err(err) => {
///       eprintln!("Error retrieving reveals: {}", err);
///   }
/// }
/// ```
pub fn get_reveals() -> Result<Vec<RevealResult>> {
    let unfiltered_reveals = get_unfiltered_reveals()?;

    Ok(unfiltered_reveals
        .into_iter()
        .filter(|reveal| reveal.in_consensus)
        .collect())
}
