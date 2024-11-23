# CLI file explorer

Simple CLI file explorer with NodeJs

## Install

```bash
$ npm install -g @danixl30/cli-file-explorer
```

## CLI

```
$ files --help
```

## Icons

For icons you must to use [MesloLGM NF]('https://www.nerdfonts.com/#home') in your terminal.

## Usage

Use ```UP``` and ```DOWN``` key to move the cursor at the directory.

Use ```CTRL + t``` to create a new tab. If the cursor in on a directory press ```t``` to create a new tab with that directory.

User ```CRTL + w``` to close current tab.

Use ```TAB``` and ```SHIFT + TAB``` to change tabs.

Use ```RIGHT``` to select files or directories. ```SHIFT + RIGHT``` to unselect. ```SHIFT + i``` to invert selection. ```SHIFT + a``` to selcet all.

Use ```c``` to copy the item in the cursor or copy current selection.

Use ```SHIFT + c``` to cut the item in the cursor or cut current selection.

Use ```p``` to paste items copied or cut. ```SHIFT + p``` to past and override if exist.

Use ```d``` and confirm with ```y``` to move file or dir to trash. ```SHIFT + d``` to romeve item, confirm with ```SHIFT + y```.

Use ```r``` to refresh current tab.

Use ```SHIFT + r``` to rename file or dir that is on cursor.

Use ```g``` to select items in dir by glob pattern.

Use ```CTRL + l``` to set path o current tab.

Use ```i``` to see details of item that is on cursor.

Use ```CTRL + d``` to close details pane.

Use ```;``` to set not blocking command.

Use ```:``` to set blocking command.

Use ```SHITF + s``` to add dir that is on cursor to bookmarks.

Use ```s``` to switch to bookmarks pane.

Use ```a``` to create a directory in current tab.

Use ```d``` in bookmarks pane to remove a bookmark.