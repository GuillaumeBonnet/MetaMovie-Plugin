<template>
	<MatPopup ref="popup-reset" title="Reset Password pop-up">
		<div class="mb-4 font-medium text-2xl">Reset your Password</div>
		<template v-if="isPostScreenShown">
			<div class="">
				An email has been sent to your inbox. Follow the link then log in.
			</div>
		</template>
		<template v-else>
			<div class="">
				Tell us the email address associated with your MetaMovie account, and
				we’ll send you an email with a link to reset your password.
			</div>
			<div class="p-4">
				<MatTextField
					v-model="email"
					label="Email"
					required="true"
				></MatTextField>
			</div>
			<div class="text-red-600" v-if="errorMessage">
				{{ errorMessage }}
			</div>
		</template>

		<template v-slot:actions>
			<template v-if="isPostScreenShown">
				<mcw-button
					data-mdc-dialog-action="cancel"
					outlined
					class="mdc-dialog__button"
					>Close</mcw-button
				>
			</template>
			<template v-else>
				<mcw-button
					data-mdc-dialog-action="cancel"
					outlined
					class="mdc-dialog__button"
					>Cancel</mcw-button
				>
				<mcw-button
					@click="resetPasswordDemandCall()"
					outlined
					class="mdc-dialog__button"
					:disabled="!email"
					>Reset Password
				</mcw-button>
			</template>
		</template>
	</MatPopup>
</template>

<script lang="ts">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                     TS                                     */
/* -------------------------------------------------------------------------- */
import { Options, Vue } from 'vue-class-component';
import MatPopup from '@/components/material/MatPopup.vue';
import MatTextField from '@/components/material/MatTextField.vue';
import { resetPassword } from '@/Utils/WebService';
import { axiosErrorMessage } from '@/Utils/MainUtils';
@Options({
	components: { MatPopup, MatTextField },
})
export default class ResetPasswordPopUp extends Vue {
	open() {
		this.email = '';
		this.isPostScreenShown = false;
		this.errorMessage = '';
		(this.$refs['popup-reset'] as MatPopup).open();
	}
	email = '';
	isPostScreenShown = false;
	errorMessage = '';

	async resetPasswordDemandCall() {
		try {
			await resetPassword(this.email);
			this.isPostScreenShown = true;
		} catch (err) {
			this.errorMessage = axiosErrorMessage(err);
		}
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
