export const TITLE = 'Password recovery';

export default function content() {
	return `
		<container class="p-5 max-w-600px">
			<form for="requestPasswordRecovery" autocomplete="off" class="surface-v1 p-5 gap-1" x-toast>

				<h2>Password recovery</h2>

				<label>
					<p for="eMail">${window.Lang.use('eMail')}</p>
					<input type="eMail" name="eMail">
				</label>

				<label>
					<input  class="btn btn-primary" type="submit" name="requestPasswordRecovery" value="Check">
					<p for="requestPasswordRecovery"></p>
				</label>

			</form>
		</container>
	`;
}
