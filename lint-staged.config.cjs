const path = require("path");
const { execSync } = require("child_process");

const quote = (files) => files.map((file) => `"${file}"`).join(" ");

const toFrontendPaths = (files) =>
  files
    .map((file) => path.relative("frontend", file))
    .filter((file) => !file.startsWith(".."));

const toBackendPaths = (files) =>
  files
    .map((file) => path.relative("backend", file))
    .filter((file) => !file.startsWith(".."));

const hasBackendSources = () => {
  try {
    execSync("git ls-files backend/app backend/tests --error-unmatch", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  "frontend/**/*.{ts,tsx,js,jsx}": (files) => {
    const frontendFiles = toFrontendPaths(files);
    if (!frontendFiles.length) {
      return [];
    }

    return [
      `cd frontend && npx eslint --max-warnings=0 --fix ${quote(frontendFiles)}`,
      `cd frontend && npx prettier --write ${quote(frontendFiles)}`
    ];
  },
  "frontend/**/*.{css,md,json}": (files) => {
    const frontendFiles = toFrontendPaths(files);
    if (!frontendFiles.length) {
      return [];
    }
    return [`cd frontend && npx prettier --write ${quote(frontendFiles)}`];
  },
  "frontend/src/**/*.{ts,tsx}": (files) => {
    const frontendFiles = toFrontendPaths(files);
    if (!frontendFiles.length) {
      return [];
    }
    return ["npm run deps:graph"];
  },
  "frontend/**/*.{ts,tsx}": (files) => {
    const frontendFiles = toFrontendPaths(files);
    if (!frontendFiles.length) {
      return [];
    }
    return [`cd frontend && npx vitest related ${quote(frontendFiles)} --runInBand`];
  },
  "backend/**/*.py": (files) => {
    if (!hasBackendSources()) {
      return [];
    }
    const backendFiles = toBackendPaths(files);
    if (!backendFiles.length) {
      return [];
    }

    return ["npm run backend:check"];
  }
};
