# Shortcut Buddy

## Todo:

* add a list of apps that currently has shortcuts

  * mega need some scraping

  - after effects
  - indesign
  - affinity designer
  - adobe experience design
  - affinity photo
  - final cut pro

  * medium

  - xcode
  - slack
  - evernote
  - firefox
  - safari
  - pages
  - numbers
  - keynote

  * tiny wins

  - microsoft excel
  - microsoft word
  - microsoft outlook
  - ia writer app
  - skitch
  - maya
  - quartz composer

- unit test
- code sign and release to app store
- create a marketing webpage

Todo:
Setup event listener such as below on `app ready`.

```
  systemPreferences.subscribeLocalNotification(
    'NSWorkspaceFrontMostApplicationChanged', (...args) => {
     //When there's no shortcut the icon should grayout and don't show the window on click
  })
```

current solution is to do pulling every second. no major performance issue.
