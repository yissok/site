const fs = require("fs");
const path = require("path");
const mapnik = require("mapnik");

// Register Mapnik plugins
mapnik.register_default_input_plugins();

const styleFile = "./style.xml";
const outputDir = "./output";
const pngDir = "./png-output"; // Directory for the generated PNGs

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Render a PBF file to PNG
async function renderPbfToPng(z, x, y) {
  return new Promise((resolve, reject) => {
    const map = new mapnik.Map(256, 256);
    map.loadSync(styleFile);

    const vectorTile = new mapnik.VectorTile(z, x, y);
    const pbfFile = path.join(outputDir, `${z}/${x}/${y}.pbf`);

    if (!fs.existsSync(pbfFile)) {
      console.error(`PBF file not found: ${pbfFile}`);
      return resolve();
    }

    const pngFile = path.join(pngDir, `${z}/${x}/${y}.png`);
    ensureDir(path.dirname(pngFile));

    vectorTile.setData(fs.readFileSync(pbfFile));

    map.render(vectorTile, new mapnik.Image(256, 256), {}, (err, image) => {
      if (err) return reject(err);

      image.save(pngFile, "png32", (saveErr) => {
        if (saveErr) return reject(saveErr);
        resolve();
      });
    });
  });
}

// Iterate through extracted PBF tiles and render them
async function renderAllPbfTiles() {
  const zoomLevels = fs
    .readdirSync(outputDir)
    .filter((z) => !isNaN(parseInt(z)));

  for (const z of zoomLevels) {
    const zoomDir = path.join(outputDir, z);
    const columns = fs.readdirSync(zoomDir);

    for (const x of columns) {
      const columnDir = path.join(zoomDir, x);
      const rows = fs.readdirSync(columnDir);

      for (const y of rows) {
        const tileY = path.basename(y, ".pbf");
        await renderPbfToPng(parseInt(z), parseInt(x), parseInt(tileY));
      }
    }
  }

  console.log("All PBF tiles have been rendered to PNGs.");
}

renderAllPbfTiles().catch((err) => console.error("Error:", err));
