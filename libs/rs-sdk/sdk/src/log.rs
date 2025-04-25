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
