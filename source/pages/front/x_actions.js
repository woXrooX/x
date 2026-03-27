export function before() { window.x.Head.set_title("actions"); }

export default async function main() {
	return `
		<container class="padding-5 gap-1 max-width-1200px">
			<row class="flex-row flex-x-start surface-v1 padding-2 gap-0-5">
				${build_modal_XR_project_Cron_Jobs_init_HTML()}
				${build_modal_XR_sanitize_users_folders_HTML()}
				${build_modal_form_eMail_send_HTML()}
			</row>
		</container>
	`;

	function build_modal_XR_project_Cron_Jobs_init_HTML() {
		return `
			<x-svg name="work_history" class="btn btn-warning" color="white"></x-svg>
			<x-tooltip trigger_selector="x-svg[name=work_history]" class="padding-2 text-size-0-8">project_Cron_Jobs_init</x-tooltip>
			<x-modal trigger_selector="x-svg[name=work_history]">
				<column class="gap-1 padding-2">
					<p class="text-align-center text-size-1-2">project_Cron_Jobs_init</p>

					<button
						XR-post
						XR-for="project_Cron_Jobs_init"
						XR-trigger="click"

						x-toast="on:any:message"

						x-modal="on:success:hide"

						class="btn btn-warning"
					>project_Cron_Jobs_init</button>
				</column>
			</x-modal>
		`;
	}

	function build_modal_XR_sanitize_users_folders_HTML() {
		return `
			<x-svg name="folder_settings" class="btn btn-warning" color="white"></x-svg>
			<x-tooltip trigger_selector="x-svg[name=folder_settings]" class="padding-2 text-size-0-8">sanitize_users_folders</x-tooltip>
			<x-modal trigger_selector="x-svg[name=folder_settings]">
				<column class="gap-1 padding-2">
					<p class="text-align-center text-size-1-2">sanitize_users_folders</p>

					<button
						XR-post
						XR-for="sanitize_users_folders"
						XR-trigger="click"

						x-toast="on:any:message"

						x-modal="on:success:hide"

						class="btn btn-warning"
					>sanitize_users_folders</button>
				</column>
			</x-modal>
		`;
	}

	function build_modal_form_eMail_send_HTML() {
		return `
			<x-svg name="eMail" class="btn btn-info"></x-svg>
			<x-tooltip trigger_selector="x-svg[name=eMail]" class="padding-2 text-size-0-8">eMail_send</x-tooltip>
			<x-modal trigger_selector="x-svg[name=eMail]">
				<form
					for="eMail_send"
					class="padding-2"
					x-modal="on:success:hide"
					x-toast="on:any:message"
				>
					<label>
						<p for="local_part">Local-part</p>
						<input type="text" name="local_part">
					</label>

					<label>
						<p for="to_email">To</p>
						<input type="eMail" name="to_email">
					</label>

					<label>
						<p for="subject">Subject</p>
						<input type="text" name="subject">
					</label>

					<label>
						<p for="content">Content</p>
						<textarea name="content" rows="5"></textarea>
					</label>

					<label>
						<input class="btn btn-primary" type="submit" name="send" value="Send">
						<p for="eMail_send"></p>
					</label>
				</form>
			</x-modal>
		`;
	}
}


