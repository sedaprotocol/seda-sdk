use anyhow::{Error, Result};
use serde::{Deserialize, Serialize};

use crate::Process;

const REVEALS_ARGUMENT_POSITION: usize = 2;
const CONSENSUS_ARGUMENT_POSITION: usize = 3;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RevealBody {
    pub dr_block_height: u64,
    pub exit_code: u8,
    pub gas_used: u64,
    pub reveal: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RevealResult {
    pub body: RevealBody,
    pub in_consensus: bool,
}

pub fn get_unfiltered_reveals() -> Result<Vec<RevealResult>> {
    let args = Process::args();

    let encoded_reveals = args
        .get(REVEALS_ARGUMENT_POSITION)
        .ok_or(Error::msg(format!(
            "Expected argument at {REVEALS_ARGUMENT_POSITION}",
        )))?;

    let encoded_consensus = args
        .get(CONSENSUS_ARGUMENT_POSITION)
        .ok_or(Error::msg(format!(
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

pub fn get_reveals() -> Result<Vec<RevealResult>> {
    let unfiltered_reveals = get_unfiltered_reveals()?;

    Ok(unfiltered_reveals
        .into_iter()
        .filter(|reveal| reveal.in_consensus)
        .collect())
}
