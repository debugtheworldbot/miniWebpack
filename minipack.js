const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

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
  const { code: transformedCode } = transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return {
    id: ID++,
    path,
    code: transformedCode,
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

const bundle = (graph) => {
  let modules = "";
  graph.forEach((g) => {
    modules += `${g.id}:[
            function(require,module,exports){
                ${g.code}
            },
            ${JSON.stringify(g.mapping)}
        ],`;
  });
  return `
    ;(function(modules){
        function require (id){
            const [fn,mapping] = modules[id]
            function localRequire(path){
                return require(mapping[path])
            }

            const module = {exports:{}}
            fn(localRequire,module,module.exports)
            return module.exports
        }
        require(0)
    })({${modules}})
  `;
};
const graph = createGraph("./src/entry.js");
const result = bundle(graph);
fs.writeFileSync("./dist/bundle.js", result, { encoding: "utf-8" });
