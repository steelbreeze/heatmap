import { IApplication } from './IApplication';
import { IAxis } from './IAxis';
import { IAxes } from './IAxes';
import { flatten } from './flatten';
import { permutations } from './permutations';
import { getAdjacency } from './getAdjacency';

/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param x The x axis
 * @param y The y axis
 * @param axesSelector A function 
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<IApplication>, x: IAxis, y: IAxis, axesSelector: (scenarios: Array<IAxes>) => IAxes = scenarios => scenarios[0], xF: (axis: IAxis) => Array<Array<string>> = flexOrder, yF: (axis: IAxis) => Array<Array<string>> = flexOrder): IAxes {
	// denormalise the underlying application data and resolve the axes
	const denormalised = flatten(applications, x, y);

	// some items not to recalculate in an O(n!) algo
	const xPerms = xF(x);
	const yPerms = yF(y);

	// retain only the scenarios with the best adjacency
	let scenarios: Array<IAxes> = [];
	let bestAdjacency = -1;

	// iterate all X and Y using the formulas provided
	for (const yValues of yPerms) {
		for (const xValues of xPerms) {
			const adjacency = getAdjacency(denormalised, xValues, yValues);

			// just keep the best scenarios
			if (adjacency >= bestAdjacency) {
				if (adjacency > bestAdjacency) {
					scenarios = [];
					bestAdjacency = adjacency;
				}

				scenarios.push({ x: { name: x.name, values: xValues }, y: { name: y.name, values: yValues } });
			}
		}
	}

	return axesSelector(scenarios);
}

/**
 * Allow an axis to be assessed in any order of the axis values.
 * @param axis The axis to flex
 * @hidden
 */
export function flexOrder(axis: IAxis): Array<Array<string>> {
	return permutations(axis.values);
}
