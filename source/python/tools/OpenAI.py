# Text Completion
# https://platform.openai.com/docs/api-reference/completions/create?lang=python

# Chat Completion
# https://platform.openai.com/docs/guides/chat

if __name__ != "__main__":

    from main import CONF

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
            if "OpenAI" not in CONF: return False

            # Check If prompt Is Valid
            if not prompt: return False

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

                return responseOpenAI["choices"][0]["text"]

            except:
                return False



        @staticmethod
        def chatCompletion(
            model="gpt-3.5-turbo",
            message=False,
            max_tokens=1000,
            temperature=0.1,
            history={}
        ):
            # Check If Feature Is Enabled
            if "OpenAI" not in CONF: return False

            # Check If prompt Is Valid
            if not message: return False

            # Messages | Chat History
            chatHistory = [
                # {"role": "system", "content": "You are a helpful assistant."},
                # {"role": "user", "content": "Who won the world series in 2020?"},
                # {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
                # {"role": "user", "content": "Where was it played?"}
            ]

            # If Initial History Passed Then Add It To Chat History
            if history: chatHistory.append(history)

            # Append User Message To Chat History
            chatHistory.append({"role": "user", "content": message})

            try:
                openai.api_key = CONF["OpenAI"]["api_key"]
                completion = openai.ChatCompletion.create(
                  model="gpt-3.5-turbo",
                  messages=chatHistory
                )

                # Append Assistant Message To Chat History
                chatHistory.append({"role": "assistant", "content": completion["choices"][0]["message"]["content"]})

                # print(completion)
                # print(chatHistory)

                return completion["choices"][0]["message"]["content"]

            except:
                return False
