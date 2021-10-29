<template>
	<MatPopup ref="popup-login" title="Log In pop-up">
		Log In:
		<div class="p-4">
			<MatTextField
				v-model="user.email"
				label="Email"
				required="true"
			></MatTextField>
		</div>
		<div class="p-4">
			<MatTextField
				v-model="user.password"
				type="password"
				label="Password"
				required="true"
			></MatTextField>
		</div>
		<div class="text-red-600" v-if="errorMessage">
			{{ errorMessage }}
		</div>
		<template v-slot:actions>
			<mcw-button
				data-mdc-dialog-action="cancel"
				outlined
				class="mdc-dialog__button"
				>Cancel</mcw-button
			>
			<mcw-button
				@click="resetPasswordDemandScreen()"
				outlined
				class="mdc-dialog__button"
				>Forgot password</mcw-button
			>
			<mcw-button
				@click="logIn()"
				outlined
				class="mdc-dialog__button"
				:disabled="!user.email || !user.password"
				>Log In</mcw-button
			>
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
import { login, logout } from '@/Utils/WebService';
import { MutationMain, UserState } from '@/store/Store';
import { axiosErrorMessage } from '@/Utils/MainUtils';
@Options({
	components: { MatPopup, MatTextField },
	emits: ['open-reset-password'],
})
export default class LoginPopUp extends Vue {
	open() {
		this.user = {
			email: '',
			password: '',
		};
		this.errorMessage = '';

		(this.$refs['popup-login'] as MatPopup).open();
	}
	user = {
		email: '',
		password: '',
	};

	errorMessage = '';

	async logIn() {
		try {
			const userInfo = await login(this.user);
			const userState: UserState = {
				isLogged: true,
				info: userInfo.data,
			};
			this.$store.commit(MutationMain.SET_USER, userState);
			this.$store.dispatch(ActionDeck.FETCH_DECKS_CURRENT_MOVIE);
			this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
			(this.$refs['popup-login'] as MatPopup).close();
		} catch (err) {
			this.errorMessage = axiosErrorMessage(err);
		}
	}
	async logoutHandler() {
		try {
			await logout();
			const userState: UserState = {
				isLogged: false,
			};
			this.$store.commit(MutationMain.SET_USER, userState);
			this.$store.dispatch(ActionDeck.FETCH_DECKS_CURRENT_MOVIE);
			this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
		} catch (err) {
			console.error('Cannot logout correctly: ', err);
		}
	}
	resetPasswordDemandScreen() {
		console.log('gboDebug:[resetPasswordDemandScreen]');
		this.$emit('open-reset-password');
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
