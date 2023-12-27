"use strict";
import {leaveFeedbackFormUI} from "../modules/helpers.js";

export const TITLE = window.Lang.use("reportProblem");

export default function content(){
	return `
		<container class="root pt-5">
			<column class="surface-clean p-5">${leaveFeedbackFormUI()}</column>
		</container>
	`;
}
