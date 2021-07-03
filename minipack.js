const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

let ID = 0;
const createAsset = (path) => {
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

const createGraph = (entry) => {
  const mainAssets = createAsset(entry);
  const assets = [mainAssets];
  for (const asset of assets) {
    const { deps } = asset;
    asset.mapping = {};
    const dir = path.dirname(asset.path);
    for (const dep of deps) {
      const absPath = path.join(dir, dep); // 'src\world' shit
      const c = `./${absPath.replace(/\\/g, "/")}`;
      const child = createAsset(c);
      asset.mapping[dep] = child.id;
      assets.push(child);
    }
  }
  return assets;
};
console.log(createGraph("./src/entry.js"));
