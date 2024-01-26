# Text Completion
# https://platform.openai.com/docs/api-reference/completions/create?lang=python

# Chat Completion
# https://platform.openai.com/docs/guides/chat

if __name__ != "__main__":

	from python.modules.Globals import Globals

	from openai import OpenAI as OpenAI_OG
	import json

	class OpenAI:
		@staticmethod
		def chatCompletion(
			model="gpt-3.5-turbo", # gpt-4
			message=False,
			history={}
		):
			# Check if feature is enabled
			if "OpenAI" not in Globals.CONF: return False

			# Check if prompt is valid
			if not message: return False

			# Chat history designed to be managed outside of this class
			# Internal history
			chat_history = [
				# {"role": "system", "content": "You are a helpful assistant."},
				# {"role": "user", "content": "Who won the world series in 2020?"},
				# {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
				# {"role": "user", "content": "Where was it played?"}
			]

			# If initial history passed then add it to "chat_history"
			if history: chat_history.append(history)

			# Append user message to chat history
			chat_history.append({"role": "user", "content": message})

			try:
				client = OpenAI_OG(api_key=Globals.CONF["OpenAI"]["api_key"])
				response = client.chat.completions.create(model=model, messages=chat_history)

				return response.choices[0].message.content

			except:
				return False
