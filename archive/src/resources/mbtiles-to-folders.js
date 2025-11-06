const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cliProgress = require("cli-progress");

// Path to your MBTiles file
const dbPath = "./countries-raster.mbtiles"; // Path to your MBTiles file
const outputDir = "./output"; // Path to output directory

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Write the binary blob directly to the file
function saveBlobAsFile(row, tilePath) {
  fs.writeFile(tilePath, row.tile_data, "binary", (err) => {
    if (err) {
      console.error(`Error writing file ${tilePath}:`, err);
    } else {
      console.log(`File saved: ${tilePath}`);
    }
  });
}

// Main function to extract tiles
async function extractTiles() {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

  db.serialize(() => {
    // Query to count total records for the progress bar
    db.get(`SELECT COUNT(*) AS count FROM tiles`, (err, countResult) => {
      if (err) {
        console.error("Error counting tiles:", err);
        return;
      }

      const totalRecords = countResult.count;
      console.log(`Total Records: ${totalRecords}`);

      // Initialize progress bar
      const bar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      bar.start(totalRecords, 0);

      let processedCount = 0;

      // Query to extract and save tiles
      db.each(
        `SELECT zoom_level, tile_column, (1 << zoom_level) - 1 - tile_row AS tile_row, tile_data 
                 FROM tiles`,
        (err, row) => {
          if (err) {
            console.error("Error querying database:", err);
            return;
          }

          // Create directory structure
          const zoomDir = path.join(outputDir, row.zoom_level.toString());
          const columnDir = path.join(zoomDir, row.tile_column.toString());
          ensureDir(columnDir);

          // File path for the tile
          const tilePath = path.join(columnDir, `${row.tile_row}.png`);

          // Save the binary blob directly as a PNG file
          saveBlobAsFile(row, tilePath);

          processedCount++;
          bar.update(processedCount);
        },
        () => {
          // On completion
          bar.stop();
          console.log("Tile extraction complete.");
          db.close();
        }
      );
    });
  });
}

// Run the script
extractTiles();
