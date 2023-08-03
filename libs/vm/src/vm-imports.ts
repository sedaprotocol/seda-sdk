
function httpFetch(memory: WebAssembly.Memory) {
  return (action: number, actionLength: number) => {
      console.log('http args', action, actionLength, memory);
  };
}

function callResultWrite(result: number, resultLength: number) {
  console.log('call result args', result, resultLength);
}

function executionResult(result: number, resultLength: number) {
  console.log('execution result args', result, resultLength);
}

export function createVmImports(wasiImports: object): WebAssembly.Imports {
  return {
    ...wasiImports,
    'env': {
      'http_fetch': httpFetch,
      'call_result_write': callResultWrite,
      'execution_result': executionResult,
    },
  };
}

export default class VmImports {
  memory?: WebAssembly.Memory;

  setMemory(memory: WebAssembly.Memory) {
    this.memory = memory;
  }

  httpFetch(action: number, actionLength: number) {
    console.log(action, actionLength, this.memory?.buffer.byteLength);
    const rawAction = new Uint8Array(this.memory?.buffer.slice(action, action + actionLength) ?? []);
    console.log(Buffer.from(rawAction).toString('utf-8'));
  }

  getImports(wasiImports: object): WebAssembly.Imports {
    return {
      ...wasiImports,
      env: {
        http_fetch: this.httpFetch.bind(this),
        call_result_write: callResultWrite,
        execution_result: executionResult,
      },
    };
  }
}
