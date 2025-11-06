const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cliProgress = require("cli-progress");

// Path to your MBTiles file
const dbPath = "./london.mbtiles";
const outputDir = "./output";
const batchSize = 1000; // Number of tiles to process in one batch

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Write the binary blob directly to the file
function saveBlobAsFile(row, tilePath) {
  fs.writeFileSync(tilePath, row.tile_data, "binary", (err) => {
    if (err) {
      console.error(`Error writing file ${tilePath}:`, err);
    }
  });
}

// Main function to extract tiles
async function extractTiles(startIndex = 0) {
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

      const bar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      bar.start(totalRecords, startIndex);

      let processedCount = 0;

      // Query to fetch a batch of tiles starting from `startIndex`
      const query = `
        SELECT zoom_level, tile_column, (1 << zoom_level) - 1 - tile_row AS tile_row, tile_data
        FROM tiles
        LIMIT ${batchSize} OFFSET ${startIndex}
      `;

      db.all(query, (err, rows) => {
        if (err) {
          console.error("Error querying database:", err);
          return;
        }

        rows.forEach((row) => {
          // Create directory structure
          const zoomDir = path.join(outputDir, row.zoom_level.toString());
          const columnDir = path.join(zoomDir, row.tile_column.toString());
          ensureDir(columnDir);

          // File path for the tile
          const tilePath = path.join(columnDir, `${row.tile_row}.pbf`);

          // Save the binary blob directly as a PNG file
          saveBlobAsFile(row, tilePath);

          processedCount++;
          bar.update(startIndex + processedCount);
        });

        bar.stop();
        console.log(`Batch complete. Processed: ${processedCount} tiles.`);

        if (startIndex + processedCount < totalRecords) {
          // Close the database and process the next batch
          db.close(() => {
            extractTiles(startIndex + processedCount);
          });
        } else {
          console.log("Tile extraction complete.");
          db.close();
        }
      });
    });
  });
}

// Run the script
extractTiles();
