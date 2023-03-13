if __name__ != "__main__":
    from __main__ import make_response

    from __main__ import CONF, langDict

    import json

    def response(
        # Response Type
        type="error",

        # Response Message (By Keyword)
        message="invalidKeyword",

        # Form Related Field
        field,

        # Actions
        updateConf,
        setSessionUser,
        deleteSessionUser,
        toast,
        domChange,
        redirect,
        reload,

        # HTTP Response Status Code
        HTTP_response_status_code=200
    ):
        # Check If Type Is Valid
        if type not in ["success", "info", "warning", "error"]: type = "error"

        # Check If Keyword Is Valid
        if message not in langDict: message="invalidKeyword"

        responseDict = {
            "type": type,
            "message": message,
        }

        # Check If Field Atgument Is Not Falsy
        # NOTE: If html field name, id or selector equals to falsy value then this check will ignore it
        if not field: responseDict["field"] = field

        #### Actions
        actionsDict = {}



        # Check If Actions Has At Least One Object
        if not actionsDict: responseDict["actions"] = actionsDict


        print("----------------------- responseDict -----------------------")
        print(responseDict)

        return make_response(json.dumps(responseDict), HTTP_response_status_code)
