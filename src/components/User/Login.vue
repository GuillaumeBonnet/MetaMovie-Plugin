<template>
	<div class="">
		<div v-if="!isLogged" class="">
			<div class="material-icons text-7xl text-gray-500 flex justify-center">
				account_circle
			</div>
			<div class="flex justify-center mt-5">
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
					<mcw-button class="font-light italic text-base">
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
					@click="logoutHandler()"
					data-mdc-dialog-action="cancel"
					outlined
					class="mdc-dialog__button"
					>Cancel</mcw-button
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
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { ActionDeck } from '@/store/DeckStore';
import MatPopup from '@/components/material/MatPopup.vue';
import MatTextField from '@/components/material/MatTextField.vue';
import { login, logout, signUp } from '@/Utils/WebService';
import { GetterMain, MutationMain, UserState } from '@/store/Store';
import { axiosErrorMessage } from '@/Utils/MainUtils';
@Options({
	components: { MatPopup, MatTextField },
})
export default class Login extends Vue {
	user = {
		email: '',
		password: '',
	};

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
		this.user = {
			email: '',
			password: '',
		};
		this.errorMessage = '';

		(this.$refs['popup-login'] as MatPopup).open();
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
	async logIn() {
		try {
			const userInfo = await login(this.user);
			const userState: UserState = {
				isLogged: true,
				info: userInfo.data,
			};
			this.$store.commit(MutationMain.SET_USER, userState);
			this.$store.dispatch(ActionDeck.FETCH_DECKS);
			this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
			(this.$refs['popup-login'] as MatPopup).close();
		} catch (err) {
			this.errorMessage = axiosErrorMessage(err);
			console.log('gboDebug:[this.errorMessage]', this.errorMessage);
		}
	}
	async signUpHandler() {
		try {
			const userInfo = await signUp(this.newUser);
			(this.$refs['popup-signup'] as MatPopup).close();
		} catch (err) {
			this.errorMessage = axiosErrorMessage(err);
			console.log('gboDebug:[this.errorMessage]', this.errorMessage);
		}
	}
	async logoutHandler() {
		try {
			await logout();
			const userState: UserState = {
				isLogged: false,
			};
			this.$store.commit(MutationMain.SET_USER, userState);
			this.$store.dispatch(ActionDeck.FETCH_DECKS);
			this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
		} catch (err) {
			console.error('Cannot logout correctly: ', err);
		}
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
