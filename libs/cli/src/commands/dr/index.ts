import { Command } from 'commander';
import { call } from './call.js';

export const dr = new Command('dr');
dr.description('commands related to Data Requests');
dr.addCommand(call);
