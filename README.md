# Contextual Shortcuts

## Todo:

* add a list of apps that currently has shortcuts
  * wunderlist
  * omnifocus
  * illustrator
  * after effects
  * sketch
  * cinema 4d
  * iterms2
  * photoshop
  * indesign
  * pixelmator
  * affinity designer
  * affinity photo
  * visual studio code
  * framer
  * slack
  * evernote
  * xcode
  * microsoft excel
  * microsoft word
  * microsoft outlook
  * atom
  * principles
  * utorrent
  * chrome
  * firefox
  * safari
  * sourcetree
  * handbrake
  * final cut pro
  * pages
  * numbers
  * keynote
  * figma
  * adobe experience design
  * ia writer app
  * skitch
  * axure
  * maya
  * flinto
  * quartz composer
* add a yml template for people to add more shortcuts
* style/polish the page
* refactor into helper fucntions
* unit test
* code sign and release to app store
* create a marketing webpage

Todo:

1.  save the list of shortcuts into memory on `app ready`.
2.  pull every second on `app ready` and check if frontmost app exist

Future Todo:
Setup event listener such as below on `app ready`.

```
  systemPreferences.subscribeLocalNotification(
    'NSWorkspaceFrontMostApplicationChanged', (...args) => {
     //When there's no shortcut the icon should grayout and don't show the window on click
  })
```

current solution is to do pulling every second. no major performance issue.
