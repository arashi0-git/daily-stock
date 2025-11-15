/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "pages-cannot-import-pages",
      comment: "page 同士の直接依存を避ける",
      severity: "warn",
      from: { path: "^src/pages/.+/.+" },
      to: { path: "^src/pages/.+/.+" }
    },
    {
      name: "features-cannot-import-pages",
      comment: "feature は page や app に依存しない",
      severity: "error",
      from: { path: "^src/features" },
      to: { path: "^src/pages" }
    },
    {
      name: "pages-only-consume-lower-layers",
      comment: "pages は features / shared のみ参照",
      severity: "error",
      from: { path: "^src/pages" },
      to: { path: "^src", pathNot: "^src/(features|shared)" }
    },
    {
      name: "shared-is-leaf",
      comment: "shared は他レイヤーに依存しない",
      severity: "error",
      from: { path: "^src/shared" },
      to: { path: "^src", pathNot: "^src/shared" }
    }
  ],
  options: {
    baseDir: "frontend",
    tsConfig: {
      fileName: "./frontend/tsconfig.json"
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+"
      }
    }
  }
};
