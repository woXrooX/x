"use strict";

export const TITLE = window.Lang.use("signUp");

export default function content() {
	return `
		<container class="p-5">
			<column class="w-50 surface-clean p-5 gap-1">

				<h2>${window.Lang.use("signUp")}</h2>

				<form action="signUp" for='signUp'>

					<row class="gap-0-5">
						<label>
							<p for='firstname'>${window.Lang.use("firstname")}</p>
							<input type='text' name='firstname'>
						</label>

						<label>
							<p for='lastname'>${window.Lang.use("lastname")}</p>
							<input type='text' name='lastname'>
						</label>

					</row>

					<label>
						<p for='eMail'>${window.Lang.use("eMail")}</p>
						<input type='eMail' name='eMail'>
					</label>

					<label>
						<p for='password'>${window.Lang.use("password")}</p>
						<input type='password' name='password' minlength='${window.CONF["password"]["min_length"]}' maxlength='${window.CONF["password"]["max_length"]}'><br>
					</label>

					<label>
						<input  class="btn btn-primary" type='submit' name='signUp' value='${window.Lang.use("signUp")}'>
						<p for='signUp'></p>
					</label>

				</form>

				<a href="/logIn" class="text-size-0-7">${window.Lang.use("haveAccountGoToLogIn")}</a>

			</column>

		</container>
  `;
}
