# Back-End (Python)

```Python
return make_response(json.dumps({
    "type": "success",
    "type": "info",
    "type": "warning",
    "type": "error",

    # "keywordOfAMessage" Must Be From Lang Dict
    "message": "keywordOfAMessage",

    # "nameAttributeValue" Must Be One Of Those -> Front-End > Form > Name OR ID Or For
    "field": "nameAttributeValue",

    # To Send Data From Back-End
    "data": {
      "key1": data1,
      "key2": data2,
      ...
    },

    "actions": {

      #### conf
      "updateConf": PUBLIC_CONF,

      #### session["user"]
      # Set
      "setSessionUser": publicSessionUser(),

      # Delete
      "deleteSessionUser": 0,

      # Toast
      "toast": {
        "type": "success",
        "type": "info",
        "type": "warning",
        "type": "error",
        "content": "My Content!"
      },

      #### To Update DOM
      "domChange": ["menu", "header", "main", "footer", "all"],

      #### Redirect
      "redirect": "me",

      #### Reload
      "reload": 0,

      #### Execute Function On Form Got Response
      "onFormGotResponse": 0

    }
}), 200)
```
