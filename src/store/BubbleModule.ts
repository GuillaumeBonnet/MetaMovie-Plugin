import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({
	name: 'BubbleModule',
	namespaced: true,
})
export default class BubbleModule extends VuexModule {
	private count = 0;

	get countGetter() {
		return this.count;
	}

	@Mutation
	increment(delta: number) {
		this.count += delta;
	}
	@Mutation
	decrement(delta: number) {
		this.count -= delta;
	}

	// action 'incr' commits mutation 'increment' when done with return value as payload
	@Action({ commit: 'increment' })
	incr() {
		return 5;
	}
	// action 'decr' commits mutation 'decrement' when done with return value as payload
	@Action({ commit: 'decrement' })
	decr() {
		return 5;
	}
}
