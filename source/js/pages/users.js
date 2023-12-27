"use strict";

export const TITLE = window.Lang.use("users");

export async function before(){

	window.pageData.usersHtml = "";

	// Get All Users
	let users = await window.bridge("users", {for:"getAllUsers"}, "application/json");

	// Check If Data Exists
	if(!!users["data"] === false){
		window.pageData.usersHtml = `
			<tr>
				<td>No records to show</td>
			</tr>
		`;
		return;
	}


	for(let user of users["data"]){
		// User Roles
		let roles = "Not assigned";
		if(user["roles_list"] !== null){

			roles = "";

			let rolesList = user["roles_list"].split(", ");

			// Skip the non_cps users
			if(rolesList.includes("non_cps")) continue;

			for(let i = 0; i < rolesList.length; i++){
				let comma = i != 0 ? ", " : "";
				roles += comma + window.Lang.use(rolesList[i]);
			}
		}

		// Check If User Has Roles
		if(!!user["roles_list"] === false)
		user["roles_list"] = [];

		// User Roles Checkboxes
		let userRolesCheckboxes = "";
		for(const user_role in window.USER_ROLES){
			// Skip X Roles
			if([1, 2, 3].includes(window.USER_ROLES[user_role]["id"])) continue;

			// Skip non_cps role
			if([8].includes(window.USER_ROLES[user_role]["id"])) continue;

			userRolesCheckboxes += `
				<label>
					<input type='checkbox' name="roles" value='${user_role}' ${user["roles_list"].includes(user_role) ? "checked" : ''}>
					${window.Lang.use(user_role)}
				</label>
			`;
		}

		window.pageData.usersHtml += `
			<tr>
				<td>${user["firstname"]}</td>
				<td>${user["lastname"]}</td>
				<td>${user["GMC_GPhC_NMC_number"] || "N/A"}</td>
				<td>${user["eMail"]}</td>
				<td>${user["password"]}</td>
				<td>${roles}</td>
				<td>
					<row class="gap-0-5">

						<x-modal trigger="click" button type="icon" icon-color="white" value="vertical_dots">
							<form action="users" for="update" class="p-2" x-modal-action="hide">

								<label>
									<p for='firstname'>${window.Lang.use("firstname")}</p>
									<input type='text' name='firstname' value='${user["firstname"]}'>
								</label>

								<label>
									<p for='lastname'>${window.Lang.use("lastname")}</p>
									<input type='text' name='lastname' value='${user["lastname"]}'>
								</label>

								<label>
									<p for='GMC_GPhC_NMC_number'>GPhC number</p>
									<info><b>Optional</b>: Add N/A if not applicable.</info>
									<input type='text' name='GMC_GPhC_NMC_number' value='${user["GMC_GPhC_NMC_number"] || "N/A"}'>
								</label>

								<label>
									<p for='eMail'>${window.Lang.use("eMail")}</p>
									<input type='email' name='eMail' value='${user["eMail"]}'>
								</label>

								<fieldset for='roles'>
									<legend>User role(s)</legend>
									${userRolesCheckboxes}
								</fieldset>

								<label>
										<p for='password'>${window.Lang.use("password")}</p>
										<input type='text' name='password' minlength='${window.CONF["password_min_length"]}' maxlength='${window.CONF["password_max_length"]}' value='${user["password"]}'>
								</label>

								<input type="hidden" name="id" value="${user["id"]}">

								<label>
									<input class="btn btn-primary" type='submit' name='update' value='${window.Lang.use("update")}'>
									<p for='update'></p>
								</label>

							</form>
						</x-modal>

						<column>
							<form action="users" for="delete">
								<input type="hidden" name="id" value="${user["id"]}">
								<button class="btn btn-primary" type="submit" name='delete'><x-icon color="white" name="trash"></x-icon></button>
							</form>
						</column>

					</row>
				</td>
			</tr>
		`;
	}
}


export default function content(){
	return `
		<container class="py-5">
			<column class="w-auto surface-clean p-5 gap-1">
				<row>${window.Lang.use("listOfAllusers")}</row>

				<row>
					<table class="x-default">

						<thead>
							<tr>
								<th>${window.Lang.use("firstname")}</th>
								<th>${window.Lang.use("lastname")}</th>
								<th>GPhC number</th>
								<th>${window.Lang.use("eMail")}</th>
								<th>${window.Lang.use("password")}</th>
								<th>Roles</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>${window.pageData.usersHtml}</tbody>

					</table>
				</row>
			</column>
		</container>
	`;
}
