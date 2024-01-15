"use strict";

export const TITLE = window.Lang.use("logOut");

export default function content(){

	return `
		<container class="p-5 gap-1">
			<p class="text-size-0-8 text-align-center">${window.Lang.use("ifLogOutWontBeAbleTo")}</p>

			<form action="logOut" for="logOut" class="w-50 surface-clean p-5">
				<label>
					<input  class="btn btn-primary" type='submit' name='logOut' value='${window.Lang.use("logOut")}'>
					<p for='logOut'>${window.Lang.use("areYouSure")}</p>
				</label>
			</form>
		</container>
	`;
}
