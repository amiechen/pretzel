# Contextual Shortcuts

## Todo:

* show a window and ask people to do a pull request when no shortcuts
* add a list of apps that currently has shortcuts
* add a yml template for people to add more shortcuts
* style/polish the page
* refactor into helper fucntions
* unit test
* code sign and release to app store
* create a marketing webpage

Todo:
1. save the list of shortcuts into memory on `app ready`.
2. pull every second on `app ready` and check if frontmost app exist



Future Todo:
Setup event listener such as below on `app ready`.
```
  systemPreferences.subscribeLocalNotification(
    'NSWorkspaceFrontMostApplicationChanged', (...args) => {
     //When there's no shortcut the icon should grayout and don't show the window on click 
  })

```
