/* eslint no-unused-vars: "off" */
"use strict";

/**
 * Interface for a plugin.
 *
 * @interface
 */
function Plugin() {}
module.exports = {
  Plugin: Plugin
};

/**
 * Returns the name of the plugin.
 *
 * @returns {string} the name of the plugin
 */
Plugin.prototype.getName = function () {
  throw new Error("not implemented: getName");
};

/**
 * Called after the Plugin instance's construction.
 *
 * @param {*} bot The bot instance
 * @returns {boolean} True if the plugin was initialized successfully.
 */
Plugin.prototype.init = function (bot) {
  throw new Error("not implemented: init");
};
/**
 * Called before SeeBorg4 shuts off.
 *
 * @returns {void}
 */
Plugin.prototype.destroy = function () {
  throw new Error("not implemented: destroy");
};