#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import {
  bold,
  underline,
  yellow,
  blue,
  magenta,
  lightMagenta,
  white,
} from "kolorist";
import type { PackageJson } from "type-fest";

// prettier-ignore
let PBandJ = `
${yellow(" ___ ") + blue("___  ") + lightMagenta("             _  ") + magenta("  _  ") }
${yellow("| _ \\") + blue(" _ )")+ lightMagenta(" __ _ _ _  __| |")  + magenta("_ | |") }
${yellow("|  _/") + blue(" _ \\")+ lightMagenta("/ _` | ' \\/ _` ")  + magenta("| || |") }
${yellow("|_| ") + blue("|___/") + lightMagenta("\\__,_|_||_\\__,_|") + magenta("\\__/ ") }
`

console.log(PBandJ);

console.log(
  bold(
    underline(
      "Welcome to " +
        yellow("P") +
        blue("B") +
        lightMagenta("and") +
        magenta("J") +
        "\n"
    )
  )
);

(async () => {
  let libraryName = "";

  await inquirer
    .prompt([
      {
        type: "input",
        name: "libraryName",
        message: "What do you want to call your component library?",
        validate(input) {
          const isValid = input.match(
            "^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$"
          );

          if (isValid) {
            return true;
          } else {
            return "Please enter a valid npm package name";
          }
        },
      },
    ])
    .then((answers: { libraryName: string }) => {
      libraryName = answers.libraryName;

      // Clone the repo to a folder called the library name
      execSync(
        `git clone https://github.com/moishinetzer/PBandJ.git "${answers.libraryName}"`,
        {
          stdio: "ignore",
        }
      );

      // Change directory to the new folder
      process.chdir(`./${answers.libraryName}`);

      const packageJsonPath = "./package.json";
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
      ) as PackageJson;
      packageJson.name = answers.libraryName;
      packageJson.version = "0.0.1";

      delete packageJson.scripts?.["build:cli"];
      delete packageJson.bin;

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    });

  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "installDependencies",
        message: "Would you like us to install dependencies for you?",
        default: false,
      },
    ])
    .then((answers: { installDependencies: boolean }) => {
      if (!answers.installDependencies) {
        console.log(
          white(
            "\n" +
              "You can install dependencies by running " +
              bold("npm install") +
              " in the project directory"
          )
        );
        return;
      }

      execSync("npm install", {
        stdio: "ignore",
      });
    });

  // delete the .git folder
  execSync("rm -rf .git", {
    stdio: "ignore",
  });

  // delete scripts/cli.ts
  execSync("rm -rf scripts/cli.ts", {
    stdio: "ignore",
  });

  // delete CHANGELOG.md
  execSync("rm -rf CHANGELOG.md", {
    stdio: "ignore",
  });

  // delete .all-contributorsrc
  execSync("rm -rf .all-contributorsrc", {
    stdio: "ignore",
  });

  console.log(
    "\n" +
      blue("cd " + libraryName) +
      "\n" +
      "\n" +
      white("You can now start developing your component library! Enjoy! 🥜💜")
  );
})();
