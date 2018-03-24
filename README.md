# Pretzel

A smart contextual shortcut finder.

[Website](https://www.amie-chen.com/pretzel/)
[Releases](https://github.com/amiechen/pretzel/releases)

## Features

* 🔍 In-App quick search: Find your specific shortcut with quick search among hundreds.
* ⚡ Detects the currently focused app.
* 🐠 Little distraction from your current task. Clicking on the menubar icon or hit `CmdorCtrl + (backtick)` on keyboard will automatically opens the shortcut panel.

## Run it locally:

```
npm install
npm start
```

To compile:

```
npm run build:mac
npm run build:win
```

## Add a shortcut:

1.  Fork the repo on github. If you don't have a github account, feel free to do send me the `.yml` file once you finish step 2 and 3.
2.  Create a text file with <your-app-name>.yml as the file name. For example, `Photoshop.yml`.
3.  Find your app's shortcuts on the web and add them to your `.yml` file, in the same format as the files in `/shortcuts` folder.
4.  Make a PR and I will merge it in and let you know.
5.  Once it's released, if you already have pretzel installed the app will notify you to install an update. If not, download [the Pretzel page]() for the latest release.
