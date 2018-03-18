# Shortcut Buddy

## Todo:

* code sign and release to app store
* create a marketing webpage

Todo:
Setup event listener such as below on `app ready`.

```
  systemPreferences.subscribeLocalNotification(
    'NSWorkspaceFrontMostApplicationChanged', (...args) => {
     //When there's no shortcut the icon should grayout and don't show the window on click
  })
```

current solution is to do pulling every second. no major performance issue.
