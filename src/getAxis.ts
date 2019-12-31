import { Application } from './Application';
import { Axis } from './Axis';
import { Dimension } from './Dimension';
import { selectMany } from './selectMany';
import { unique } from './unique';

/**
 * Returns the unique set of values within an application data set for a given dimension.
 * @param applications The applications data.
 * @param name The name of the dimension.
 * @returns Returns the axis with its values.
 */
export function getAxis(applications: Array<Application>, name: Dimension): Axis {
	return { name, values: selectMany(applications, app => app.usage, use => use[name]).filter(unique) };
}
