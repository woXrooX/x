# Back-End (Python)

```Python
return make_response(json.dumps({
    "type": "success",
    "type": "info",
    "type": "warning",
    "type": "error",

    "message": "keywordOfAMessage", # From Lang Dict
    "field": "nameAttributeValue", # From Front-End Form Name OR ID Or For

    "actions": {

      #### conf
      "updateConf": PUBLIC_CONF,

      #### session["user"]
      # Set
      "setSessionUser": publicSessionUser(),

      # Delete
      "deleteSessionUser": 0,

      #### Redirect
      "redirect": {
        "url": "me"
      },

      #### To Update DOM
      # menu header main footer all
      "domChange": {
        "section": "menu"
      },

      #### Reload
      "reload": 0

    }
}), 200)
```
