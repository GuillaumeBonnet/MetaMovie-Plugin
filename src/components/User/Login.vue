<template>
	<div class="">
		<div v-if="!isLogged" class="">
			<div class="material-icons text-7xl text-gray-500 flex justify-center">
				account_circle
			</div>
			<div class="flex justify-center m-5">
				<mcw-button @click="logInPopup()">LOG IN</mcw-button>
				<mcw-button @click="signInPopup()" outlined class="ml-2"
					>SIGN IN</mcw-button
				>
			</div>
		</div>
		<template v-else>
			<div class="flex justify-center align-middle">
				<div class="material-icons text-7xl text-gray-500">
					account_circle
				</div>
				<div class="ml-5">
					<div class="align-middle font-bold">
						{{ userInfo?.username }}
					</div>
					<mcw-button
						@click="openUserDecks()"
						class="font-light italic text-base"
					>
						{{ userInfo?.nbOfDecks }} decks
					</mcw-button>
					<div class=""></div>
				</div>
			</div>
			<div class="flex justify-center">
				<mcw-button @click="logoutHandler()" outlined class="mt-5">
					Log out
				</mcw-button>
			</div>
		</template>

		<LoginPopUp
			ref="login-popup-cmp"
			@open-reset-password="resetPopup()"
		></LoginPopUp>
		<ResetPasswordPopUp ref="reset-popup-cmp"></ResetPasswordPopUp>
		<MatPopup ref="popup-signup" title="Sign Up pop-up">
			Sign Up:
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
			<template v-slot:actions>
				<mcw-button
					outlined
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button"
					>Cancel</mcw-button
				>
				<mcw-button
					outlined
					@click="signUpHandler()"
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button"
					:disabled="!newUser.email || !newUser.username || !newUser.password"
					>Sign Up</mcw-button
				>
			</template>
		</MatPopup>
	</div>
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
import LoginPopUp from '@/components/User/LoginPopUp.vue';
import ResetPasswordPopUp from '@/components/User/ResetPasswordPopUp.vue';
import { logout, signUp } from '@/Utils/WebService';
import { GetterMain, MutationMain, UserState } from '@/store/Store';
import { axiosErrorMessage } from '@/Utils/MainUtils';
@Options({
	components: { MatPopup, MatTextField, LoginPopUp, ResetPasswordPopUp },
	emits: ['open-user-decks'],
})
export default class Login extends Vue {
	newUser = {
		email: '',
		password: '',
		username: '',
	};

	errorMessage = '';

	get isLogged() {
		return this.$store.getters[GetterMain.IS_LOGGED];
	}
	get userInfo() {
		return this.$store.state.user.info;
	}
	logInPopup() {
		(this.$refs['login-popup-cmp'] as LoginPopUp).open();
	}
	resetPopup() {
		(this.$refs['reset-popup-cmp'] as ResetPasswordPopUp).open();
	}
	signInPopup() {
		this.newUser = {
			email: '',
			password: '',
			username: '',
		};
		this.errorMessage = '';
		(this.$refs['popup-signup'] as MatPopup).open();
	}
	async signUpHandler() {
		try {
			await signUp(this.newUser);
			(this.$refs['popup-signup'] as MatPopup).close();
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
	openUserDecks() {
		this.$emit('open-user-decks');
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
