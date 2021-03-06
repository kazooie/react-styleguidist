import React from 'react';
import noop from 'lodash/noop';
import Examples from '../Examples';
import Components from '../Components';
import Sections from '../Sections';
import Section from './Section';
import { SectionRenderer } from './SectionRenderer';

const section = {
	name: 'Foo',
	content: [
		{
			type: 'code',
			content: '<button>OK</button>',
			evalInContext: noop,
		},
		{
			type: 'markdown',
			content: 'Hello *world*!',
		},
	],
	components: [],
	sections: [],
};

it('should render component renderer', () => {
	const actual = shallow(
		<Section
			section={section}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should render components list', () => {
	const actual = shallow(
		<Section
			section={{
				name: 'Components',
				components: [],
			}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should not render components list if not defined', () => {
	const actual = shallow(
		<Section
			section={{
				name: 'No components',
			}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should render sections if defined', () => {
	const actual = shallow(
		<Section
			section={{
				name: 'Nested sections',
				sections: [],
			}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should not render sections if not defined', () => {
	const actual = shallow(
		<Section
			section={{
				name: 'No sections',
			}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('render should render component', () => {
	const actual = shallow(
		<SectionRenderer
			classes={{}}
			name={section.name}
			content={<Examples examples={section.content} />}
			components={<Components components={[]} />}
			sections={<Sections sections={[]} />}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('render should not render title if name is not set', () => {
	const actual = render(
		<SectionRenderer
			classes={{}}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('render should render title if name is set', () => {
	const actual = render(
		<SectionRenderer
			classes={{}}
			name="test"
		/>
	);

	expect(actual).toMatchSnapshot();
});

