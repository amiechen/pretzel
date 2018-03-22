# Pretzel

A contextual shortcut finder. Works on all platforms

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

## Notes:

Setup event listener such as below on `app ready`.

```
  systemPreferences.subscribeLocalNotification(
    'NSWorkspaceFrontMostApplicationChanged', (...args) => {
     //When there's no shortcut the icon should grayout and don't show the window on click
  })
```

current solution is to do pulling every second. no major performance issue.
