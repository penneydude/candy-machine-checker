const path = require("path");
const fs = require("fs");

const directoryPath = path.join(__dirname, "../../public/CANDY_MACHINE_CONFIG");
fs.readdir(directoryPath, function(err, files) {
  if (err) {
    console.error("Unable to scan CANDY_MACHINE_CONFIG directory: " + err);
    process.exit(1);
  }

  files.forEach(function(file) {
    if (file !== ".gitignore") {
      console.log(`Using CM config: CANDY_MACHINE_CONFIG/${file}`);

      fs.writeFileSync("src/cm.json", `{ "cm": "${file}" }`, function(err) {
        if (err) {
          console.error("Unable to write cm.json: " + err);
          process.exit(1);
        }
      });

      process.exit(0);
    }
  });

  console.error("CANDY_MACHINE_CONFIG is empty. It should contain the file that 'candy-machine upload' generated into .cache.");
});
