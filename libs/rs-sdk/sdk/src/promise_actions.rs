use serde::{Deserialize, Serialize};

use crate::http::HttpFetchAction;

/// Represents an action that can be executed asynchronously.
/// This enum is serialized and sent to the VM for execution.
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PromiseAction {
    Http(HttpFetchAction),
}
