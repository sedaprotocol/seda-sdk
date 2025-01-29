use serde::{Deserialize, Serialize};

use crate::http::HttpFetchOptions;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PromiseAction {
    Http(HttpFetchAction),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct HttpFetchAction {
    pub url: String,
    pub options: HttpFetchOptions,
}
