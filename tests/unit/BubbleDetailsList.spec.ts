import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CardsCurrentDeck from '@/components/CardsCurrentDeck.vue';

describe('CardsCurrentDeck.vue', () => {
	it('test the ', () => {
		// cannot launch tests with current configuration
		const wrapper = shallowMount(CardsCurrentDeck, {
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
