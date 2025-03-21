(module
  ;; Import WASI functions
  (import "wasi_snapshot_preview1" "proc_exit" (func $proc_exit (param i32)))
  (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

  ;; Create memory with maximum possible pages (65536 pages = 4GB)
  (memory (export "memory") 65536)

  ;; Define a data segment to write 'Hello, World!' to memory at offset 0
  (data (i32.const 0) "Hello, World!")

  ;; Define a buffer for the iovec structure
  (global $iovec_buffer (mut i32) (i32.const 1048576)) ;; Arbitrary offset for iovec buffer

  ;; Export _start function required by WASI
  (func $start (export "_start")
    ;; Write 'Hello, World!' to memory at offset 0
    i32.const 0  ;; offset
    i32.const 72 ;; 'H'
    i32.store8

    i32.const 1
    i32.const 101 ;; 'e'
    i32.store8

    i32.const 2
    i32.const 108 ;; 'l'
    i32.store8

    i32.const 3
    i32.const 108 ;; 'l'
    i32.store8

    i32.const 4
    i32.const 111 ;; 'o'
    i32.store8

    i32.const 5
    i32.const 44  ;; ','
    i32.store8

    i32.const 6
    i32.const 32  ;; ' '
    i32.store8

    i32.const 7
    i32.const 87  ;; 'W'
    i32.store8

    i32.const 8
    i32.const 111  ;; 'o'
    i32.store8

    i32.const 9
    i32.const 114  ;; 'r'
    i32.store8

    i32.const 10
    i32.const 108  ;; 'l'
    i32.store8

    i32.const 11
    i32.const 100  ;; 'd'
    i32.store8

    i32.const 12
    i32.const 33  ;; '!'
    i32.store8

    ;; Prepare iovec structure
    i32.const 0
    global.get $iovec_buffer
    i32.store ;; iovec base

    i32.const 13 ;; length of 'Hello, World!'
    global.get $iovec_buffer
    i32.const 4
    i32.add
    i32.store ;; iovec length

    ;; Call fd_write to write to stdout
    i32.const 1 ;; file descriptor for stdout
    global.get $iovec_buffer
    i32.const 1 ;; number of iovecs
    global.get $iovec_buffer
    i32.const 8
    i32.add
    call $fd_write

    ;; Exit the program
    i32.const 0
    call $proc_exit
    drop ;; Ensure the stack is empty after proc_exit
  )
)
