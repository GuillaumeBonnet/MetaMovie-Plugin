import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CardDetailsList from '@/components/CardDetailsList.vue';

describe('CardDetailsList.vue', () => {
	it('test the ', () => {
		// cannot launch tests with current configuration
		const wrapper = shallowMount(CardDetailsList, {
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
