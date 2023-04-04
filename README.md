# Guide

1. Open Chrome in Debug mode, make sure you quite Chrome first.

### Mac

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

### Windows (not tested)

[Follow the instructions here](https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0)

2. Open beartracks, login, and navigate to a course page

3. Run the script (You must have node installed)

```
node index.js
```

4. Customization

You can modify the filters and timeout in `index.js` to your liking.
