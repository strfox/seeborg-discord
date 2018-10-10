"use strict";
const fs = require("fs");
const path = require("path");

const logger = require("./logging").getLogger(module);

class PluginManager {
  /**
   * Creates an instance of PluginManager.
   *
   * @param {*} bot The SeeBorg4 instance
   *
   * @prop {*} bot
   * @prop {Array.<*>} loadedPlugins The plugins loaded by this plugin manager
   */
  constructor(bot) {
    this.bot = bot;
    this.loadedPlugins = [];
  }

  /**
   * Loads plugins into this.loadedPlugins.
   *
   * @returns {void}
   */
  loadPlugins() {
    if (this.loadedPlugins.length > 0) {
      throw new Error("called loadPlugins after some plugins have already been loaded");
    }

    const pluginsDirectory = path.resolve(__dirname, "..", "plugins/");
    const pluginFiles = fs.readdirSync(pluginsDirectory);

    for (let pluginFile of pluginFiles) {
      // Relative path is needed to require()
      const relativePath = path.relative(__dirname, path.resolve(pluginsDirectory, pluginFile));
      const plugin = require(relativePath);

      try {
        logger.info("Loading plugin: " + plugin.getName());
        plugin.init(this.bot);
        this.loadedPlugins.push(plugin);
      } catch (err) {
        logger.error(`Error while loading plugin "${plugin.filename}"! This could be a programming error: ${err.message}`);
        throw err;
      }
    }
  }

  /**
   * Destroy this plugin manager, and unload all loaded plugins.
   *
   * @returns {void}
   */
  destroy() {
    for (let plugin of this.loadedPlugins) {
      plugin.destroy();
    }
    this.loadedPlugins = [];
  }
}

module.exports = {
  PluginManager: PluginManager
};