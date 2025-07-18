export function before(){
	window.x.Head.set_title("actions");
}

export default async function main(){
	return `
		<container class="padding-5 gap-1">
			<row class="flex-row flex-x-start surface-v1 padding-2 gap-0-5">
				<x-svg
					name="folder_settings"

					XR-post
					XR-for="sanitize_users_folders"
					XR-trigger="click"

					x-toast="on:any:message"

					class="btn btn-warning"
				></x-svg>
				<!-- SANITIZE USERS FOLDERS -->

				<x-svg name="eMail" class="modal_eMail_write btn btn-info"></x-svg>
				<x-modal trigger_selector="x-svg.modal_eMail_write">
					<form for="eMail_send" class="padding-1" x-modal="on:success:hide" x-toast="on:any:message">
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
			</row>
		</container>
	`;
}


