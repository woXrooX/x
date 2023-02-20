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
│
│─── x-webapp
│
└─── pages
     │
     │─── back
     │      home.py
     │
     └─── front
            home.js
