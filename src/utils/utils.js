export function setComponentsNames(components) {
	components.map((component) => {
		let module = component.module;
		module = module.default || module;
		component.name = module.displayName || module.name;
		if (!component.name) {
			throw Error(`Cannot detect component name for ${component.filepath}`);
		}
	});
	return components;
}

export function globalizeComponents(components) {
	components.map((component) => {
		let module = component.module;
		module = module.default || module;
		global[component.name] = module;
	});
}
