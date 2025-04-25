/// A debug macro that prints the expression and its value to stderr.
///
/// This macro is a more gas-efficient alternative to the standard `dbg!` macro.
/// It evaluates the given expression, prints the source location, expression text,
/// and its debug representation to standard error.
///
/// # Examples
///
/// ```
/// let a = 2;
/// let b = debug!(a * 2) + 1;
/// // Prints to stderr: [src/main.rs:2:9] a * 2 = 4
/// assert_eq!(b, 5);
/// ```
///
/// Multiple values can be debugged at once:
///
/// ```
/// let x = 1;
/// let y = 2;
/// debug!(x, y, x + y);
/// // Prints each value on a separate line with location information
/// ```
///
/// # Notes
///
/// This macro requires that the expression's type implements the `Debug` trait.
#[macro_export]
macro_rules! debug {
    ($expr:expr) => {
        match $expr {
            expr => {
                use std::io::Write;
                // Format the debug message
                std::io::stderr().write_all(format!("[{}:{}] {} = {:#?}\n", file!(), line!(), stringify!($expr), &expr).as_bytes())?;

                expr
            }
        }
    };
    ($($val:expr),+ $(,)?) => {
        ($($crate::debug!($val)),+,)
    };
}

/// A logging macro that prints the value to stdout, with a newline.
///
/// This macro is a more gas-efficient alternative to regular println! statements.
/// It evaluates the given expression and writes its display representation to standard output,
/// followed by a newline.
///
/// # Examples
///
/// ```rust
/// # use seda_sdk_rs::log;
/// let value = 42;
/// log!("{}", value);  // Prints: 42\n
/// log!("The answer is: {}", value);  // Prints: The answer is: 42\n
/// ```
///
/// # Notes
///
/// This macro requires that the expression's type implements the `Display` trait.
#[macro_export]
macro_rules! log {
    ($($arg:tt)*) => {{
        use std::io::Write;
        let _ = std::io::stdout().write_all(format!("{}\n", format_args!($($arg)*)).as_bytes());
        ()
    }};
}

/// A logging macro that prints the value to stderr, with a newline.
///
/// This macro is a more gas-efficient alternative to regular eprintln! statements.
/// It evaluates the given expression and writes its display representation to standard error,
/// followed by a newline.
///
/// # Examples
///
/// ```rust
/// # use seda_sdk_rs::elog;
/// let error_code = 404;
/// elog!("{}", error_code);  // Prints: 404\n
/// elog!("Error {}: Not Found", error_code);  // Prints: Error 404: Not Found\n
/// ```
///
/// # Notes
///
/// This macro requires that the expression's type implements the `Display` trait.
#[macro_export]
macro_rules! elog {
    ($($arg:tt)*) => {{
        use std::io::Write;
        let _ = std::io::stderr().write_all(format!("{}\n", format_args!($($arg)*)).as_bytes());
        ()
    }};
}
