# How To Use X-WebApp?

---

## Initializing
1. Create a git repository **MyWebSite**
2. **cd** into **MyWebSite**
3. Use command: **git submodule add** https://github.com/woXrooX/x-webapp
4. **cd** into **x-webapp**
5. Use command: **git submodule update --init**
6. **cd** back to **MyWebSite**
7. Create the ./MyWebSite/**project.json** file
8. Create a folder called ./MyWebSite/**pages**
9. Create a folder called ./MyWebSite/pages/**back** to store site's pages back-end codes
10. Create the ./MyWebSite/pages/back/**home.py**
11. Create a folder called ./MyWebSite/pages/**front** to store site's pages front-end codes
12. Create the ./MyWebSite/pages/front/**home.js**

#### Note!
**project.json**, **home.py** and **home.js** are requiered files in order to start the X-WebApp!
W/O them X-WebApp will not start.

---

## Updating the X-WebApp
1. **cd** into **x-webapp**
2. Use command: **git pull**

---

## File Structure
```
MyWebSite
│    project.json
│    languageDictionary.json
│
│─── x-webapp
│
│─── SVG
│
└─── pages
     │
     │─── back
     │      home.py
     │
     └─── front
            home.js
```

---

## project.json (Requiered)
Uisng **project.json** you can control followings
1. Database configurations

2. Defaults
  - currency
  - title
  - language

3. Menu
  - Enable / Disable
  - List of menus to be shown

4. Pages
  - Enable / Disable each page
  - Who can visit the specific page
  - Page url(s)

---

## languageDictionary.json (Optional)
```languageDictionary["keyword"]["languageCode"] -> Text```

```JSON
{
  "keyword":{
    "en":"Text in english",
    "ru":"Текст на русском",
    ...
  },
  ...
}
```

---

## SVG (Optional)
If you want to add **.svg** files you need to create a folder called **SVG**
