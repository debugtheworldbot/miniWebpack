const fs = require("fs");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

let ID = 0;
const cteateAsset = (path) => {
  const code = fs.readFileSync(path, "utf-8");
  const ast = parse(code, {
    sourceType: "module",
  });
  const deps = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value);
    },
  });
  return {
    id: ID++,
    path,
    code,
    deps,
  };
};

const createGraph = (path) => {
  const mainAssets = cteateAsset("./src/entry.js");
  const assets = [mainAssets];
  for (const asset of assets) {
    const { deps } = asset;
    const dirName = path.dirName(asset.path);
    for (const dep of deps) {
      const child = createAsset(dep);
      assets.push(child);
    }
  }
};
createGraph("./src/entry.js");
