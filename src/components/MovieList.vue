<template>
	<div
		v-if="isShown"
		class="min-width-deck-selector p-6 absolute bottom-0 transform custom-translate-list rounded-md bg-gray-700"
	>
		<button
			class="block ml-auto material-icons rounded-md w-12 h-12 text-3xl outline-none focus:outline-none bg-gray-600 hover:bg-gray-800 border-1 border-solid border-gray-900 hover:shadow transform transition-transform duration-300 ease-in-out"
			@click="closeButton()"
			@mousedown.stop
		>
			close
		</button>
		<h1 class="mdc-typography--headline4">Movies that have decks:</h1>
		<mcw-list class="movie-list mh-screen50 overflow-y-auto text-xl">
			<template v-for="movie of movies" :key="movie.netflixId">
				<mcw-list-item class="cursor-default">
					<div class="">
						{{ movie.name }}
					</div>
					<template #meta>
						<div class="flex items-center">
							<div class="mr-4">{{ movie.nbDecks }} decks</div>
							<a :href="`${rootUrl}/watch/${movie.netflixId}`">
								<mcw-fab mini icon="open_in_browser"></mcw-fab>
							</a>
						</div>
					</template>
				</mcw-list-item>
				<li role="separator" class="mdc-list-divider"></li>
			</template>
		</mcw-list>
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
import { fetchMovies } from '@/Utils/WebService';
import { MovieAndCount } from '@/models/ApiTypes';

@Options({
	components: {},
	emits: ['movie-list-close'],
})
export default class MovieList extends Vue {
	@Prop()
	isShown!: boolean;
	movies!: MovieAndCount[];

	get rootUrl() {
		return window.location.origin;
	}

	async created() {
		this.movies = (await fetchMovies()).data;
	}
	closeButton() {
		this.$emit('movie-list-close');
	}
}
</script>

<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
ul.movie-list .mdc-list-item {
	cursor: default;
}
</style>
<style scoped lang="scss">
.custom-translate-list {
	transform: translateX(-110%);
}
.min-width-deck-selector {
	min-width: 150%;
}
</style>
