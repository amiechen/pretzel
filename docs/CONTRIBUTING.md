# Contributing to Pretzel

We love your input! We also want to make the contributing process as easy as possible. Please follow these steps and guidelines:

1.  Fork the repo on GitHub.
2.  Create a text file with <your-app-name>.yml as the file name. For example, `Photoshop.yml`.
3.  Find your app's shortcuts on the internet and add them to your `.yml` file. The yml file should be valid and follow these rules:

* wrap both the shortcut keys and values in **double quotes**, such as `"Quit App": "Cmd + q"`
* Replace `⌃ ⌘ ⌥ ⇧` by `Ctrl Cmd Opt Shift` , separated by spaces. I find doing so is best for usability and readability.
* clean up any trailing whitespace.
* take a look at the files in `/shortcuts` folder as an example.

4.  Test your commit locally by running `npm install && npm start`. Navigate to your desired app and see if the shortcut shows up in Pretzel.
5.  Make a PR and I will merge it in and let you know.
6.  Once it's released, if you already have pretzel installed the app will notify you to install an update.

That's it. Thanks again for contributing!
