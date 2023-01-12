'use strict';

const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;
const Mainloop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const FIREFOX_ICON = "firefox16.png";
const CHROME_ICON = "chrome16.png";

let button, icon, gicon_firefox, gicon_chrome;


function init(metadata) {
}


function toggleDefaultBrowser() {
  //let [ok, out, err, exit] = GLib.spawn_command_line_sync('sh -c "[[ "$(xdg-settings check default-web-browser firefox.desktop)" == "yes" ]] && (echo yes; xdg-settings set default-web-browser google-chrome.desktop) || (echo no; xdg-settings set default-web-browser firefox.desktop)"');
  let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings check default-web-browser firefox.desktop");
  if (ByteArray.toString(out).includes('yes')) {
    icon.set_gicon(gicon_chrome)
    let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings set default-web-browser google-chrome.desktop");
  } else {
    icon.set_gicon(gicon_firefox)
    let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings set default-web-browser firefox.desktop");
  }
}


function enable() {
  button = new PanelMenu.Button(0.0);
  icon = new St.Icon({ style_class: 'system-status-icon' });
  gicon_firefox = Gio.icon_new_for_string(Me.path + "/icons/" + FIREFOX_ICON);
  gicon_chrome = Gio.icon_new_for_string(Me.path + "/icons/" + CHROME_ICON);

  let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings check default-web-browser firefox.desktop");

  if (ByteArray.toString(out).includes('yes')) {
    icon.set_gicon(gicon_firefox)
  } else {
    icon.set_gicon(gicon_chrome)
  }

  button.actor.add_actor(icon);
  button.actor.connect('button-press-event', toggleDefaultBrowser);
  Main.panel.addToStatusArea('default-web-browser', button);
}


function disable() {
  button.destroy();
  button = null;
  icon = null;
  gicon_firefox = null;
  gicon_chrome = null;
}
