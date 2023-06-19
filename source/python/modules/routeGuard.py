if __name__ != "__main__":
    from main import request, redirect, url_for
    from python.modules.Logger import Log
   
    def routeLogs():
        # request
        # <Request 'http://localhost:5000/js/pages/home.js' [GET]>
        # Log.info(request) 
        
        # method
        # Log.info(request.method) 

        # url
        # http://localhost:5000/js/pages/home.js
        # Log.info(request.url)
        
        # path
        # /js/pages/home.js
        # Log.info(request.path)

        # args - ImmutableMultiDict([])
        # Log.info(request.args)
        # Log.info(request.args.get('key'))
        # Log.info(request.args.keys())    
        # Log.info(request.args.values())
        
        # cookies - ImmutableMultiDict([])
        # Log.info(request.cookies)
        
        # headers
        # Log.info(request.headers)

        # Log.info(request.content_type)
        # Log.info(request.form)
        # Log.info(request.files)
        # Log.info(request.get_json)
        
        # Log Structure
        # [method] [url] [content_type] [form] [files] [get_json]
        
        Log.info(f"[{request.method}] [{request.url}]")

        if request.content_type is None: pass

        elif "multipart/form-data;" in request.content_type:
            Log.center(f"Contet-Type: {request.content_type}", '-')
            
            for key, value in request.form.items(): 
                print(f"{key}: {request.form.getlist(key) if len(request.form.getlist(key)) > 1 else value}")

            if len(request.files) > 0:
                for key, value in request.files.items(): print(f"{key}: {value}")
            
            Log.center('', '-')
            
            # logText += f" [{request.form}]"
            # logText += f" [{request.files}]" if len(request.files) > 0 else ''

        elif request.content_type == "application/json":
            Log.center(f"Contet-Type: {request.content_type}", '-')
            
            if isinstance(request.get_json(), dict):
                for key, value in request.get_json().items(): Log.raw(f"{key}: {value}")
            
            else: Log.raw(request.get_json())


            Log.center('', '-')        


    def routeGuard():
        pass
        # Log.info(request.path)
        # Log.warning(request.path.split("/")[1])          