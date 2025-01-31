use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, spanned::Spanned, ItemImpl};

fn validate_fn(item: &syn::ImplItemFn, errors: &mut Vec<syn::Error>) {
    if item.sig.unsafety.is_some() {
        errors.push(syn::Error::new(
            item.sig.span(),
            "Function must not be unsafe.",
        ));
    }

    if item.sig.abi.is_some() {
        errors.push(syn::Error::new(
            item.sig.span(),
            "Function must not have an ABI(extern C).",
        ));
    }

    if item.sig.constness.is_some() {
        errors.push(syn::Error::new(
            item.sig.span(),
            "Function must not be const.",
        ));
    }

    if item.sig.asyncness.is_some() {
        errors.push(syn::Error::new(
            item.sig.span(),
            "Function must not be async.",
        ));
    }

    if !item.sig.generics.params.is_empty() {
        errors.push(syn::Error::new(
            item.sig.generics.span(),
            "Function must not have generics or lifetimes.",
        ));
    }

    if !item.sig.inputs.is_empty() {
        errors.push(syn::Error::new(
            item.sig.inputs.span(),
            "Function must not take any arguments.",
        ));
    }

    if item.sig.variadic.is_some() {
        errors.push(syn::Error::new(
            item.sig.variadic.span(),
            "Function must not be variadic.",
        ));
    }

    match &item.sig.output {
        syn::ReturnType::Default => {}
        _ => {
            errors.push(syn::Error::new(
                item.sig.output.span(),
                "Function must not have a return type.",
            ));
        }
    }
}

#[proc_macro_attribute]
pub fn oracle_program(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as ItemImpl);

    // Ensure only the execute and tally methods are present
    let mut execute_fn = None;
    let mut tally_fn = None;

    let mut errors = Vec::new();
    let input_span = input.span();
    for item in input.items {
        match item {
            syn::ImplItem::Const(item) => errors.push(syn::Error::new(
                item.span(),
                "Consts are not allowed to be defined in this macro.",
            )),
            syn::ImplItem::Fn(item) => {
                if item.sig.ident == "execute" {
                    execute_fn = Some(item);
                } else if item.sig.ident == "tally" {
                    tally_fn = Some(item);
                } else {
                    errors.push(syn::Error::new(
                        item.span(),
                        "Only the functions tally and execute are allowed.",
                    ));
                }
            }
            syn::ImplItem::Type(item) => errors.push(syn::Error::new(
                item.span(),
                "Only the type Error is allowed to be defined in this macro.",
            )),
            syn::ImplItem::Macro(item) => errors.push(syn::Error::new(
                item.span(),
                "Macros are not allowed to be defined in this macro.",
            )),
            syn::ImplItem::Verbatim(item) => errors.push(syn::Error::new(
                item.span(),
                "Verbatims are not allowed to be defined in this macro.",
            )),
            _ => unreachable!(),
        }
    }

    // Ensure there is either an execute or tally or both methods
    // replace missing ones with a dummy function
    let (execute_fn, tally_fn) = match (execute_fn, tally_fn) {
        (Some(execute_fn), Some(tally_fn)) => {
            validate_fn(&execute_fn, &mut errors);
            validate_fn(&tally_fn, &mut errors);
            (execute_fn, tally_fn)
        }
        (Some(execute_fn), None) => {
            let tally_fn: syn::ImplItemFn = syn::parse_quote! {
                fn tally() {
                    seda_sdk_rs::Process::error(&"Tally is not implemented.".to_bytes());
                }
            };
            validate_fn(&execute_fn, &mut errors);
            (execute_fn, tally_fn)
        }
        (None, Some(tally_fn)) => {
            let execute_fn: syn::ImplItemFn = syn::parse_quote! {
                fn execute() {
                    seda_sdk_rs::Process::error(&"Execute is not implemented.".to_bytes());
                }
            };
            validate_fn(&tally_fn, &mut errors);
            (execute_fn, tally_fn)
        }
        (None, None) => {
            let mut combined_error = syn::Error::new(
                input_span,
                "At least one of the functions execute or tally must be defined.",
            );
            for e in errors {
                combined_error.combine(e);
            }
            return combined_error.to_compile_error().into();
        }
    };

    if !errors.is_empty() {
        let mut combined_error = errors.remove(0);
        for e in errors {
            combined_error.combine(e);
        }
        return combined_error.to_compile_error().into();
    }

    let expanded = quote! {

        fn main() {

            #execute_fn
            #tally_fn

            if seda_sdk_rs::Process::is_dr_vm_mode() {
                return execute();
            }
            return tally();
        }
    };

    TokenStream::from(expanded)
}
