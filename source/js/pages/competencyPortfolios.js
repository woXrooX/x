"use strict";

let competencyPortfolios;
let portfolios;

export async function before(){
  // Get All Portfolios
  competencyPortfolios = await window.bridge("competencyPortfolios", {for:"getAllMyCompetencyPortfolios"});

  // Convert Portfolios To Array
  // To Be Able To Use .sort(func) Later
  portfolios = [];
  portfolios.push(...competencyPortfolios.data.all);

}


export const TITLE = window.Lang.use("competencyPortfolios");

export default function content(){
	return `
		<container class="competencyPortfolios my-5 gap-2">
			<column class="w-auto p-5 surface-clean gap-1">

				<h3>${window.Lang.use("competencyPortfolios")}</h3>

				<form action="competencyPortfolios" for="downloadAllAsPDF">
					<label class="w-100 d-flex flex-x-end flex-y-center gap-1">
					<p for='downloadAllAsPDF'>Download all as PDF</p>
					<button class="btn btn-primary" name="downloadAllAsPDF"><x-icon color="white" name="download"></x-icon></button>
					</label>
				</form>

				<table class="x-default">

					<thead>
					<tr>
						<th for="type">
						<div class="d-flex flex-row flex-y-center gap-1">
							<p>Record type</p>
							<x-icon name="sort" color="var(--color-text-accent)"></x-icon>
						</div>
						</th>
						<th>Title</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th for="level">
						<div class="d-flex flex-row flex-y-center gap-1">
							<p>Level</p>
							<x-icon name="sort" color="var(--color-text-accent)"></x-icon>
						</div>
						</th>
						<th for="competency_area">
						<div class="d-flex flex-row flex-y-center gap-1">
							<p>Competency area</p>
							<x-icon name="sort" color="var(--color-text-accent)"></x-icon>
						</div>
						</th>
						<th>Actions</th>
					</tr>
					</thead>

					<tbody></tbody>

				</table>

			</column>
		</container>
	`;

}

export async function after(){
  // Init Portfolios
  updateTable();

  sortButtons();
}

export function onFormGotResponse(response){
	// downloadAllAsPDF
	window.open(response.data.url, '_blank').focus();
}

function updateTable(){
	const tableBody = document.querySelector("container.competencyPortfolios > column > table > tbody");

	let portfoliosHTML = "No records to show";
	tableBody.innerHTML = portfoliosHTML;

	if(!!portfolios === false || portfolios.length === 0) return;

	portfoliosHTML = "";

	for(const portfolio of portfolios){
		portfoliosHTML += `
			<tr>
				<td>${window.Lang.use(portfolio["portfolio_type"])}</td>
				<td>${portfolio["title"]}</td>
				<td>${portfolio["start_date"] || "N/A"}</td>
				<td>${portfolio["end_date"] || "N/A"}</td>
				<td>${window.Lang.use(portfolio["level"] || "N/A")}</td>
				<td>${portfolio["competency_areas_list"] ? portfolio["competency_areas_list"].split(',')[0] : "N/A"}</td>
				<td>
					<container>
						<row class="gap-0-5">

							<column>
								<x-modal trigger="click" button type="icon" icon-color="white" value="eye">
									<column class="flex-y-start text-size-0-8 p-2">
										<p><b>Title:</b> ${portfolio.title}</p>
										${!!portfolio.start_date ? `<p><b>Start date:</b> ${portfolio.start_date}</p>` : ""}
										${!!portfolio.end_date ? `<p><b>End date:</b> ${portfolio.end_date}</p>` : ""}
										${!!portfolio.number_of_hours ? `<p><b>Number of hours:</b> ${portfolio.number_of_hours}</p>` : ""}
										${!!portfolio.level ? `<p><b>Level:</b> ${window.Lang.use(portfolio.level)}</p>` : ""}

										${!!portfolio.description ? `<p><b>Description:</b> ${portfolio.description}</p>` : ""}
										${!!portfolio.competency_areas_list ? `<p><b>Competency area(s):</b> ${portfolio.competency_areas_list}</p>` : ""}

										${!!portfolio.supervisor_full_name ? `<p><b>Supervisor full name:</b> ${portfolio.supervisor_full_name}</p>` : ""}
										${!!portfolio.workplace_employer ? `<p><b>Workplace employer:</b> ${portfolio.workplace_employer}</p>` : ""}
										${!!portfolio.job_role ? `<p><b>Job role:</b> ${portfolio.job_role}</p>` : ""}
										${!!portfolio.eMail ? `<p><b>Email:</b> ${portfolio.eMail}</p>` : ""}
										${!!portfolio.phone_number ? `<p><b>Telephone number:</b> ${portfolio.phone_number}</p>` : ""}
										${!!portfolio.GMC_GPhC_NMC_number ? `<p><b>GMC GPhC NMC number:</b> ${portfolio.GMC_GPhC_NMC_number}</p>` : ""}
										${!!portfolio.other ? `<p><b>Other:</b> ${portfolio.other}</p>` : ""}
										${!!portfolio.provider ? `<p><b>Provider:</b> ${portfolio.provider}</p>` : ""}

										${!!portfolio.date ? `<p><b>Date of feedback:</b> ${portfolio.date}</p>` : ""}
										${!!portfolio.from ? `<p><b>Who the feedback is from:</b> ${portfolio.from}</p>` : ""}
										${!!portfolio.feedback ? `<p><b>Feedback details:</b> ${portfolio.feedback}</p>` : ""}

										${!!portfolio.file ? `<p><b>File:</b> <a href="/users/${window.session["user"]["id"]}/documents/${portfolio.file}" target="_blank">View</a></p>` : ""}
									</column>
								</x-modal>
							</column>

							<column>
								<a class="btn btn-primary" href="/users/${window.session["user"]["id"]}/documents/${portfolio.portfolio_type}_${portfolio.id}.pdf" target="_blank">
									<x-icon color="white" name="pdf"></x-icon>
								</a>
							</column>

							<column>
								<form action="competencyPortfolios" for="delete">
									<input type="hidden" name="id" value="${portfolio["id"]}">
									<input type="hidden" name="portfolioType" value="${portfolio["portfolio_type"]}">
									<button class="btn btn-primary" type="submit" name='delete'><x-icon color="white" name="trash"></x-icon></button>
								</form>
							</column>

						</row>
					</container>
				</td>
			</tr>
		`;
	}

	tableBody.innerHTML = portfoliosHTML;

	// Collect Forms Manually After Dom Change
	window.Form.collect(tableBody);

}

//////// Sorts
// Buttons
function sortButtons(){
	const sortButtons = document.querySelector("container.competencyPortfolios > column > table > thead > tr");

	// By Type
	let byTypeDone = false;
	sortButtons.querySelector("th[for='type']").addEventListener("click", ()=>{

		if(byTypeDone === false) portfolios.sort(sortByType);
		else portfolios.sort(sortByTypeRev);

		updateTable();

		byTypeDone = !byTypeDone;
	});

	// By Level
	let byLevelDone = false;
	sortButtons.querySelector("th[for='level']").addEventListener("click", ()=>{

		if(byLevelDone === false) portfolios.sort(sortByLevel);
		else portfolios.sort(sortByLevelRev);

		updateTable();

		byLevelDone = !byLevelDone;
	});

	// By Competency Area
	let byCompetencyAreaDone = false;
	sortButtons.querySelector("th[for='competency_area']").addEventListener("click", ()=>{

		if(byCompetencyAreaDone === false) portfolios.sort(sortByCompetencyArea);
		else portfolios.sort(sortByCompetencyAreaRev);

		updateTable();

		byCompetencyAreaDone = !byCompetencyAreaDone;
	});
}

// By Type
function sortByType(a, b){
  if(a.portfolio_type < b.portfolio_type) return -1;

  if(a.portfolio_type > b.portfolio_type) return 1;

  return 0;

}
// By Type Reverse
function sortByTypeRev(a, b){
  if(a.portfolio_type < b.portfolio_type) return 1;

  if(a.portfolio_type > b.portfolio_type) return -1;

  return 0;

}

// By Level
function sortByLevel(a, b){
  if(a.level < b.level) return -1;

  if(a.level > b.level) return 1;

  return 0;

}
// By Level Reverse
function sortByLevelRev(a, b){
  if(a.level < b.level) return 1;

  if(a.level > b.level) return -1;

  return 0;

}

// By Competency Area
function sortByCompetencyArea(a, b){
  if(a.competency_areas_list < b.competency_areas_list) return -1;

  if(a.competency_areas_list > b.competency_areas_list) return 1;

  return 0;

}
// By Competency Area Reverse
function sortByCompetencyAreaRev(a, b){
  if(a.competency_areas_list < b.competency_areas_list) return 1;

  if(a.competency_areas_list > b.competency_areas_list) return -1;

  return 0;

}
