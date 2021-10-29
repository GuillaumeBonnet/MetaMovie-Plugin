<template>
	<div
		class="bg-gray-800 border-gray-500 border p-4 -m-1 flex flex-col justify-center"
	>
		<h1 class="text-3xl mx-auto text-white font-bold whitespace-nowrap">
			Meta Movie
		</h1>
		<menu class="text-xs flex flex-col p-0">
			<ul class="w-full">
				<a ref="external" target="_blank" href="https://www.netflix.com/browse">
					<mcw-button outlined class="my-2 w-full">Try on Netflix</mcw-button>
				</a>
			</ul>
			<ul class="w-full">
				<mcw-button outlined class="my-2 w-full">About</mcw-button>
			</ul>
			<ul class="w-full">
				<mcw-button outlined class="my-2 w-full">Chrome page</mcw-button>
			</ul>
			<ul class="w-full">
				<a
					ref="external"
					target="_blank"
					href="https://github.com/GuillaumeBonnet/MetaMovie-Plugin"
				>
					<mcw-button outlined class="my-2 w-full">Github</mcw-button>
				</a>
			</ul>
			<ul class="w-full">
				<mcw-button outlined class="my-2 w-full">Contact</mcw-button>
			</ul>
		</menu>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
	components: {},
})
export default class AppPopUp extends Vue {}
</script>
<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
</style>
