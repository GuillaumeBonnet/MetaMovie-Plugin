import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({
	name: 'BubbleModule',
	namespaced: true,
})
export default class BubbleModule extends VuexModule {
	private _areBubbleDisplayed = true;

	get areBubbleDisplayed(): boolean {
		return this._areBubbleDisplayed;
	}

	@Mutation
	toggleAreBubleHidden() {
		this._areBubbleDisplayed = !this._areBubbleDisplayed;
	}
}
