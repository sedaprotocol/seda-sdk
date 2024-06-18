import { Command } from "commander";
import { call } from "./call.js";
import { issue } from "./issue.js";

export const dr = new Command("dr");
dr.description("commands related to Data Requests");
dr.addCommand(call);
dr.addCommand(issue);
