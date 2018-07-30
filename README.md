<p align="left">
  <a href="https://www.amie-chen.com/pretzel/" target="_blank">
    <img alt="Parcel" src="./screenshot/logo.png" width="200">
  </a>
</p>

Pretzel is Mac desktop app that shows and search keyboard shortcuts based on your current app. [Checkout the landing page here.](https://www.amie-chen.com/pretzel)

## Features

* 🔍 In-App quick search: Find your specific shortcut with quick search among hundreds.
* ⚡ Detects the currently focused app.
* 🐠 Little distraction from your current task. Clicking on the menubar icon or hit `CmdorCtrl + (backtick)` on keyboard will automatically opens the shortcut panel.

![app-screen-shot](./screenshot/app-screen.png)

## Download for Mac

[Download the latest release](https://github.com/amiechen/pretzel/releases)

## Run it locally (if you are curious):

### Important! Because Pretzel has a dependency [node-ffi](https://github.com/node-ffi/node-ffi) that requires node v8, until `node-ffi` is compaitable with 
latest node, you should use `nvm` to install node v8 to run Pretzel locally. Otherwise, `npm install` would give you some error regarding node-gyp.

```
nvm install 8.11.3 # I personally use this version
nvm ls # to make sure we are currently using node v8

npm install
npm start
```

Compile Scss

```
sass --watch sass/main.scss:main.css
```

To compile:

```
npm run build:mac
npm run build:win
```

## Add a shortcut:

If you **have** github account, please [check the roadmap first](https://github.com/amiechen/pretzel/projects/1?add_cards_query=is%3Aopen) then read [the Contributing doc here](./docs/CONTRIBUTING.md)

If you **don't have** a github account, please check the [roadmap first](https://github.com/amiechen/pretzel/projects/1?add_cards_query=is%3Aopen). If you don't see desired apps under development, follow these steps:

1.  Create a text file with <your-app-name>.yml as the file name. For example, `Photoshop.yml`.
2.  Find your app's shortcuts on the web and add them to your `.yml` file, in the same format as the files in `/shortcuts` folder.
3.  Send me the `.yml` file so I could add it in.

## License

MIT © [Amie Chen](https://amie-chen.com)
