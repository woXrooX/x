# https://platform.openai.com/docs/api-reference/completions/create?lang=python

if __name__ != "__main__":

    from __main__ import CONF
    from python.tools.response import response

    import openai
    import json

    class MySQL:

        @staticmethod
        def prompt(
            model="text-davinci-003",
            prompt,
            max_tokens=1000,
            temperature=0.1
        ):
            # Check If Feature Is Enabled
            if "OpenAI" not in CONF: response(type="info", message="OpenAI Is Not Enabled!")

            # Check If prompt Is Valid
            if not prompt: return response(type="error", message="Invalid Prompt!")

            try:
                openai.api_key = CONF["OpenAI"]["api_key"]
                response = openai.Completion.create(
                  model="text-davinci-003",
                  prompt=prompt,
                  max_tokens=max_tokens,
                  temperature=0.3,
                  top_p=1,
                  n=1,
                  stream=False,
                  logprobs=None
                  # stop="\n"
                )

                return response(type="success", data={"OpenAI": response})

            except:
                return response(type="error", message="OpenAIError")
