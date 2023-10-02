import { Command } from 'commander';
import { upload } from './upload.js';
import { list } from './list.js';

export const wasm = new Command('wasm');
wasm.description('commands related to WASM binaries');
wasm.addCommand(upload);
wasm.addCommand(list);
