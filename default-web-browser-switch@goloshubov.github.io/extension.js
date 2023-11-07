import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as ExtensionUtils from 'resource:///org/gnome/shell/misc/extensionUtils.js';

const ByteArray = imports.byteArray;
const FIREFOX_ICON = "firefox16.png";
const CHROME_ICON = "chrome16.png";


export default class DefaultBrowserExtension extends Extension {
    enable() {
      const gicon_firefox = Gio.icon_new_for_string(this.path + "/icons/" + FIREFOX_ICON);
      const gicon_chrome = Gio.icon_new_for_string(this.path + "/icons/" + CHROME_ICON);

      this._button = new PanelMenu.Button(0.0);
      this._icon = new St.Icon({ style_class: 'system-status-icon' });

      let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings check default-web-browser firefox.desktop");

      if (ByteArray.toString(out).includes('yes')) {
        this._icon.set_gicon(gicon_firefox)
      } else {
        this._icon.set_gicon(gicon_chrome)
      }

      this._button.actor.add_actor(this._icon);
      this._button.actor.connect('button-press-event', (item, event) => {
          let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings check default-web-browser firefox.desktop");
          if (ByteArray.toString(out).includes('yes')) {
              this._icon.set_gicon(gicon_chrome)
              //let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings set default-web-browser google-chrome.desktop");
              let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings set default-web-browser com.google.Chrome.desktop");
          } else {
              this._icon.set_gicon(gicon_firefox)
              let [ok, out, err, exit] = GLib.spawn_command_line_sync("xdg-settings set default-web-browser firefox.desktop");
          }
      });

      Main.panel.addToStatusArea('default-web-browser', this._button);
    }

    disable() {
      this._button?.destroy();
      this._button = null;
      this._icon?.destroy();
      this._icon = null;
    }
}
