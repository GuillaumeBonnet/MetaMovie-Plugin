import {
	Module,
	VuexModule,
	Mutation,
	Action,
	MutationAction,
} from 'vuex-module-decorators';

@Module({
	name: 'MainStore',
	namespaced: true,
})
export default class MainStore extends VuexModule {
	private _isFullScreen = !!document.fullscreenElement;

	/* -------------------------------------------------------------------------- */
	/*                                   getters                                  */
	/* -------------------------------------------------------------------------- */

	get isFullScreen() {
		return this._isFullScreen;
	}

	/* -------------------------------------------------------------------------- */
	/*                                  mutations                                 */
	/* -------------------------------------------------------------------------- */

	@Mutation
	setIsFullScreen(isFullScreen: boolean) {
		this._isFullScreen = isFullScreen;
	}

	/* -------------------------------------------------------------------------- */
	/*                                   actions                                  */
	/* -------------------------------------------------------------------------- */
}
