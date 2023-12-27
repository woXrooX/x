"use strict";

export const TITLE = window.Lang.use("competencyPortfolio_management");

export async function before(){
	// Get All Portfolios
	const allCompetencyPortfolios = await window.bridge("competencyPortfolio/management", {for:"getAllCompetencyPortfolios"});

	// Convert Portfolios To Array
	// To Be Able To Use .sort(func) Later
	window.pageData.portfolios = [];
	window.pageData.portfolios.push(...allCompetencyPortfolios.data.all);

	window.pageData.portfoliosHTML = "No records to show";

	if(!!window.pageData.portfolios === false || window.pageData.portfolios.length === 0) return;

	window.pageData.portfoliosHTML = "";

	for(const portfolio of window.pageData.portfolios)
		window.pageData.portfoliosHTML += `
			<tr>
				<td>${portfolio["owner_full_name"]}</td>
				<td>${window.Lang.use(portfolio["portfolio_type"])}</td>
				<td>${portfolio["title"]}</td>
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

										${!!portfolio.file ? `<p><b>File:</b> <a a href="/users/${portfolio["owner"]}/documents/${portfolio.file}" target="_blank">View</a></p>` : ""}
									</column>
								</x-modal>
							</column>

							<column>
								<a class="btn btn-primary" href="/users/${portfolio["owner"]}/documents/${portfolio.portfolio_type}_${portfolio.id}.pdf" target="_blank">
									<x-icon color="white" name="pdf"></x-icon>
								</a>
							</column>

						</row>
					</container>

				</td>
			</tr>
		`;
}

export default function content(){
	return `
		<container class="competencyPortfolios my-5">
			<column class="w-auto p-5 surface-clean gap-1">

				<h3>${window.Lang.use("competencyPortfolios")}</h3>

				<table class="x-default">

					<thead>
					<tr>
						<th>Full name</th>
						<th>Record type</th>
						<th>Title</th>
						<th for="level">Level</th>
						<th for="competency_area">Competency area</th>
						<th>Actions</th>
					</tr>
					</thead>

					<tbody>${window.pageData.portfoliosHTML}</tbody>

				</table>

			</column>
		</container>
	`;
}
