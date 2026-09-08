#!/usr/bin/env node

import "dotenv/config";

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";

import { login, logout, whoami } from "./commands/auth/login.js";
import { wakeup } from "./commands/ai/wakeup.js";

async function main() {

  const command = process.argv[2];

  const showBanner = !command;


  const accent = chalk.hex("#22C55E");
  const white = chalk.white;
  const secondary = chalk.gray;
  const muted = chalk.dim.gray;

  if (showBanner) {
    console.log();

    console.log(
      accent(
        figlet.textSync("COGNIVEX", {
          font: "Standard",
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
      ),
    );

    console.log(
      `  ${white("Cognitive Autonomous Agent")}  ${muted("· v0.1.0")}`,
    );

    console.log(
      `  ${secondary(
        "Reason, explore, and execute developer tasks through autonomous AI agents.",
      )}`,
    );

    console.log();

    console.log(muted(`  ${"─".repeat(54)}`));

    console.log();

    console.log(
      `  ${secondary("Get started")}      ${white("cognivex login")}`,
    );

    console.log(
      `  ${secondary("Start agent")}      ${white("cognivex wakeup")}`,
    );

    console.log(
      `  ${secondary("All commands")}     ${white("cognivex --help")}`,
    );

    console.log();
  }


  const program = new Command();

  program
    .name("cognivex")
    .version("0.1.0")
    .description("Cognitive Autonomous Agent")
    .addCommand(login)
    .addCommand(logout)
    .addCommand(whoami)
    .addCommand(wakeup);

  program.parse();
}

main().catch((error) => {
  console.log();

  console.log(chalk.red("  ✕ Error running cognivex cli"));

  console.log(chalk.dim(`    ${error?.message || error}`));

  console.log();

  process.exit(1);
});
