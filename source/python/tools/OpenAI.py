# https://platform.openai.com/docs/api-reference/completions/create?lang=python

if __name__ != "__main__":

    from __main__ import CONF

    import openai
    import json

    class MySQL:

        @staticmethod
        def prompt(prompt, model="text-davinci-003", temperature=0.1):
            # Check If Feature Is Enabled
            if "OpenAI" not in CONF: return "OpenAI Is Not Enabled!"

            # Check If prompt Is Valid
            if not prompt: return "Invalid Prompt!"


                openai.api_key = CONF["OpenAI"]["api_key"]
                response = openai.Completion.create(
                  model="text-davinci-003",
                  prompt=prompt,
                  max_tokens=1000,
                  temperature=0.3,
                  top_p=1,
                  n=1,
                  stream=False,
                  logprobs=None
                  # stop="\n"
                )




req = f"""text"""

openai.api_key = "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"
response = openai.Completion.create(
  model="text-davinci-003",
  prompt=req,
  max_tokens=1000,
  temperature=0.3,
  top_p=1,
  n=1,
  stream=False,
  logprobs=None
  # stop="\n"
)

print(response)

with open("responses.txt", "w") as file:
    file.write(response)
