# Text Completion
# https://platform.openai.com/docs/api-reference/completions/create?lang=python

# Chat Completion
# https://platform.openai.com/docs/guides/chat

if __name__ != "__main__":

    from __main__ import CONF
    from python.tools.response import response

    import openai
    import json

    class OpenAI:

        @staticmethod
        def textCompletion(
            model="text-davinci-003",
            prompt=False,
            max_tokens=1000,
            temperature=0.1
        ):
            # Check If Feature Is Enabled
            if "OpenAI" not in CONF: return response(type="info", message="OpenAI Is Not Enabled!")

            # Check If prompt Is Valid
            if not prompt: return response(type="error", message="Invalid Prompt!")

            try:
                openai.api_key = CONF["OpenAI"]["api_key"]
                responseOpenAI = openai.Completion.create(
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

                return response(type="success", data=responseOpenAI["choices"][0]["text"])

            except:
                return response(type="error", message="OpenAIError")



        @staticmethod
        def chatCompletion(
            model="gpt-3.5-turbo",
            message=[],
            max_tokens=1000,
            temperature=0.1
        ):
            # Check If Feature Is Enabled
            if "OpenAI" not in CONF: return response(type="info", message="OpenAI Is Not Enabled!")

            # Check If prompt Is Valid
            if not message: return response(type="error", message="Invalid Messages!")

            # Messages | Chat History
            chatHistory = [
                # {"role": "system", "content": "You are a helpful assistant."},
                # {"role": "user", "content": "Who won the world series in 2020?"},
                # {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
                # {"role": "user", "content": "Where was it played?"}
            ]

            # Append User Message
            chatHistory.append({"role": "user", "content": message})

            try:
                openai.api_key = CONF["OpenAI"]["api_key"]
                completion = openai.ChatCompletion.create(
                  model="gpt-3.5-turbo",
                  messages=chatHistory
                )

                print(completion)

                # Append Assistant Message
                chatHistory.append({"role": "assistant", "content": completion["choices"][0]["message"]["content"]})

                return response(type="success", data=completion["choices"][0]["message"]["content"])

            except:
                return response(type="error", message="OpenAIError")
