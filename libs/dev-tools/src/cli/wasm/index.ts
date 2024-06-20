import { Command } from 'commander';
import { upload } from './upload';
import { list } from './list';
import { show } from './show';

export const wasm = new Command('wasm');
wasm.description('commands to list, show, and upload WASM binaries');
wasm.addCommand(upload);
wasm.addCommand(list);
wasm.addCommand(show);
