"use strict";



export async function before(){
  ////// getAllData
  let data = await window.bridge("policiesMatrix", {for:"getAllData"}, "application/json");
  window.pageData.policiesHtml = ``;

  // Create Policy Names
  for(let policy of data["data"]["policies"]){
    window.pageData.policiesHtml += `<th><p class="text-nowrap">${policy["name"]}</p></th>`;
  }

  // Create User Names
  window.pageData.usersHtml = ``;

  // Go Through Each User
  for(let user of data["data"]["users"]){
    let userAgreedPolicies = ``;

    // Go Through Each Policy And Check If User Agreed Or Not
    for(let policy of data["data"]["policies"]){
      // By Default Not Agreed
      let isUserAgreed = `<td style="background-color:var(--color-error)">Missing</td>`;

      for(const userAgreedPolicy of data["data"]["usersAgreedPolicies"])
        if(userAgreedPolicy["user"] == user["id"] && userAgreedPolicy["policy"] == policy["id"])
          // If Abaove Is True Then Agrees
          isUserAgreed = `<td style="background-color:var(--color-success)">Agreed</td>`;

        userAgreedPolicies += isUserAgreed;

    }

    // User Type Id To Name
    for(const user_type in window.USER_TYPES)
      if(window.USER_TYPES[user_type]["id"] == user["type"])
        user["type"] = window.USER_TYPES[user_type]["name"];

        window.pageData.usersHtml += `
        <tr>
          <td>${user["firstname"]} ${user["lastname"]}</td>
          ${userAgreedPolicies}
        </tr>
      `;
  }

}


export const TITLE = window.Lang.use("policiesMatrix");
export default function content(){
	return `
		<container class="p-5 gap-1">

			<h1>${window.Lang.use("policiesMatrix")}</h1>

			<column class="w-90 surface-clean p-5">

				<table class="scrollbar-x x-default max-vw-90">

					<thead>
						<tr class="text-nowrap">
						<th>Firstname and lastame</th>
						${window.pageData.policiesHtml}
						</tr>
					</thead>

					<tbody>${window.pageData.usersHtml}</tbody>

				</table>

			</column>

		</container>
	`;
}
