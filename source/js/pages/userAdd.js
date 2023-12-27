"use strict";

export const TITLE = window.Lang.use("addUser");
export default function content(){

	// User Roles Checkboxes
	let userRolesCheckboxes = "";
	for(const user_role in window.USER_ROLES){
		// Skip X Roles
		if([1, 2, 3].includes(window.USER_ROLES[user_role]["id"])) continue;

		// Skip non_cps role
		if([8].includes(window.USER_ROLES[user_role]["id"])) continue;

		userRolesCheckboxes += `
			<label>
				<input type='checkbox' name="roles" value='${user_role}'>
				${window.Lang.use(user_role)}
			</label>
		`;
	}

	return `
		<container class="my-5">
			<row>
				<column class="w-50 surface-clean p-5">

					<row>
						${window.Lang.use("addUser")}
					</row>

					<row>
						<form action="userAdd" for="userAdd">

							<label>
								<p for='firstname'>${window.Lang.use("firstname")}</p>
								<input type='text' name='firstname'>
							</label>

							<label>
								<p for='lastname'>${window.Lang.use("lastname")}</p>
								<input type='text' name='lastname'>
							</label>

							<label>
								<p for='GMC_GPhC_NMC_number'>GPhC number</p>
								<info id="tooltip_GMC_GPhC_NMC_number"></info>
								<x-tooltip selector="info#tooltip_GMC_GPhC_NMC_number"><b>Optional</b>: Add N/A if not applicable.</x-tooltip>
								<input type='text' name='GMC_GPhC_NMC_number'>
							</label>

							<label>
								<p for='eMail'>${window.Lang.use("eMail")}</p>
								<input type='email' name='eMail'>
							</label>

							<fieldset for='roles'>
								<legend>User role(s)</legend>
								${userRolesCheckboxes}
							</fieldset>

							<label>
								<input class="btn btn-primary" type='submit' name='userAdd' value='${window.Lang.use("save")}'>
								<p for='userAdd'></p>
							</label>

						</form>
					</row>

				</column>
			</row>
		</container>
	`;
}
