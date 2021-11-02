<template>
	<MatPopup ref="popup-signup" title="Sign Up pop-up">
		Sign Up:
		<template v-if="!hasSignedUp">
			<div class="p-4">
				<MatTextField
					v-model="newUser.email"
					label="Email"
					required="true"
				></MatTextField>
			</div>
			<div class="p-4">
				<MatTextField
					v-model="newUser.username"
					label="Username"
					required="true"
				></MatTextField>
			</div>
			<div class="p-4">
				<MatTextField
					v-model="newUser.password"
					type="password"
					label="Password"
					required="true"
				></MatTextField>
			</div>
			<div class="text-red-600" v-if="errorMessage">
				{{ errorMessage }}
			</div>
		</template>
		<template v-else>
			<p>
				To finish creating your account,
			</p>
			<p>
				confirm your email address with the email we sent you.
			</p>
		</template>
		<template v-slot:actions>
			<mcw-button
				outlined
				data-mdc-dialog-action="cancel"
				class="mdc-dialog__button"
			>
				{{ hasSignedUp ? 'Close' : 'Cancel' }}
			</mcw-button>
			<mcw-button
				v-if="!hasSignedUp"
				outlined
				data-mdc-dialog-action=""
				@click="signUpHandler()"
				class="mdc-dialog__button"
				:disabled="!newUser.email || !newUser.username || !newUser.password"
			>
				Sign Up
			</mcw-button>
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
import { ActionDeck } from '@/store/DeckStore';
import MatPopup from '@/components/material/MatPopup.vue';
import MatTextField from '@/components/material/MatTextField.vue';
import { login, logout, signUp } from '@/Utils/WebService';
import { MutationMain, UserState } from '@/store/Store';
import { axiosErrorMessage } from '@/Utils/MainUtils';
@Options({
	components: { MatPopup, MatTextField },
	emits: ['open-reset-password'],
})
export default class SignUpPopUp extends Vue {
	open() {
		this.newUser = {
			email: '',
			password: '',
			username: '',
		};
		this.errorMessage = '';
		this.hasSignedUp = false;
		(this.$refs['popup-signup'] as MatPopup).open();
	}
	newUser = {
		email: '',
		password: '',
		username: '',
	};

	errorMessage = '';
	hasSignedUp = false;

	async signUpHandler() {
		try {
			await signUp(this.newUser);
			this.hasSignedUp = true;
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
