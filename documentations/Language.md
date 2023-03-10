# Language
- Accessible through **window** `window.Language`
- **Lang** is alias to the **Language**
- Has two methods
  - Language.translate(keyword, langCode) : string
  - Language.use(keyword) : string



## How To Use


#### Language.translate(keyword, langCode)
To get the corresponding text to the **keyword** in **langCode** translation
```JavaScript
window.Language.translate("keyword", "en");
Language.translate("keyword", "en");

window.Lang.translate("keyword", "en");
Lang.translate("keyword", "en");
```


#### Language.use(keyword)

To get just the corresponding text to the **keyword**

```JavaScript
window.Language.use("keyword");
Language.use("keyword");

window.Lang.use("keyword");
Lang.use("keyword");
```
