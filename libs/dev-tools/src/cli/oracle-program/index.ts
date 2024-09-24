import { Command } from "commander";
import { list } from "./list";
import { show } from "./show";
import { upload } from "./upload";

export const oracleProgram = new Command("oracle-program");
oracleProgram.description("commands to list, show, and upload Oracle Programs");
oracleProgram.addCommand(upload);
oracleProgram.addCommand(list);
oracleProgram.addCommand(show);
