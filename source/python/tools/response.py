if __name__ != "__main__":
    from __main__ import make_response

    from __main__ import PUBLIC_CONF

    from python.tools.tools import publicSessionUser

    import json

    def response(
        # Response Type
        type="error",

        # Response Message (By Keyword)
        message="invalidKeyword",

        # Form Related Field
        field=False,

        # Custom Data
        data={},

        # Actions
        updateConf=False,
        setSessionUser=False,
        deleteSessionUser=False,
        toast={},
        domChange=[],
        redirect=False,
        reload=False,

        # HTTP Response Status Code
        HTTP_response_status_code=200
    ):
        ######## Type
        # Check If Type Is Valid
        if type not in ["success", "info", "warning", "error"]: type = "error"

        ######## Message
        # Looks like no need for this check here since Front-End Lang.use covers bugs
        # Check If Keyword Is Valid
        # if message not in langDict: message="invalidKeyword"

        ######## Response Dict
        responseDict = {
            "type": type,
            "message": message,
        }

        ######## Field
        # Check If Field Argument Is Not Falsy
        # NOTE: If html field name, id or selector equals to falsy value then this check will ignore it
        if field is not False: responseDict["field"] = field

        ######## Data
        if data: responseDict["data"] = data

        ######## Actions
        actionsDict = {}

        ## updateConf
        if updateConf: actionsDict["updateConf"] = PUBLIC_CONF

        ## setSessionUser
        if setSessionUser is True: actionsDict["setSessionUser"] = publicSessionUser()

        ## deleteSessionUser
        if deleteSessionUser is True: actionsDict["deleteSessionUser"] = 0

        ## toast
        if toast: actionsDict["toast"] = toast

        ## domChange
        if domChange: actionsDict["domChange"] = domChange

        ## redirect
        if redirect: actionsDict["redirect"] = redirect

        ## reload
        if reload: actionsDict["reload"] = 0

        # Check If Actions Has At Least One Object
        if actionsDict: responseDict["actions"] = actionsDict


        # print("----------------------- responseDict -----------------------")
        # print(responseDict)

        return make_response(json.dumps(responseDict), HTTP_response_status_code)
