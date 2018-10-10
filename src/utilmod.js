"use strict";

module.exports = {
  console: {
    /**
     * Pauses the console, and waits for the user to press any key to unpause.
     *
     * @returns {void}
     */
    pause() {
      return new Promise((resolve, reject) => {
        console.log("Press any key to continue...");
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", () => {
          process.stdin.setRawMode(false);
          resolve();
        });
      });
    }
  }
};