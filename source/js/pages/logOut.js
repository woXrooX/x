"use strict";

export const TITLE = window.Lang.use("logOut");

export default function main(){

	return `
		<container class="p-5 gap-1">
			<p class="text-size-0-8 text-align-center">${window.Lang.use("ifLogOutWontBeAbleTo")}</p>

			<form action="logOut" for="logOut" class="w-50 surface-v1 p-5">
				<label>
					<input  class="btn btn-primary" type='submit' name='logOut' value='${window.Lang.use("logOut")}'>
					<p for='logOut'>${window.Lang.use("areYouSure")}</p>
				</label>
			</form>
		</container>
	`;
}
