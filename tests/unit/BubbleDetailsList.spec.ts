import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CurrentDeck from '@/components/CurrentDeck.vue';

describe('CurrentDeck.vue', () => {
	it('test the ', () => {
		// cannot launch tests with current configuration
		const wrapper = shallowMount(CurrentDeck, {
			propsData: {},
		});
		const cmpDetailsList = wrapper.vm as any;
		console.log(
			'gboDebug:[cmpDetailsList.readableTime(1)]',
			cmpDetailsList.readableTime(1)
		);
		expect(cmpDetailsList.readableTime(1).to.be('0:00:01'));
	});
});
