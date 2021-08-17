// @steelbreeze/landscape
// Copyright (c) 2019-21 David Mesquita-Morris
import { Cube, Dimension, Func1, Func2, Row } from '@steelbreeze/pivot';

/** The final text and class name to use when rendering cells in a table. */
export interface Key {
	/** The text to use in the final table rendering. */
	text: string;

	/** The class name to use in the final table rendering. */
	className: string;
}

/** An extension of key, adding the number of rows and columns the key will occupy in the final table rendering. */
export interface Cell extends Key {
	/** The number of rows to occupy. */
	rowSpan: number;

	/** The number of columns to occupy. */
	colSpan: number;
}

/**
 * Generates a table from a cube and its axis.
 * @param cube The source cube.
 * @param xAxis The x axis.
 * @param yAxis The y axis.
 * @param getKey A callback to generate a key containing the text and className used in the table from the source records,
 * @param onX A flag to indicate if cells in cube containing multiple values should be split on the x axis (if not, the y axis will be used).
 */
export function table<TRow extends Row>(cube: Cube<TRow>, xAxis: Dimension<TRow>, yAxis: Dimension<TRow>, getKey: Func1<TRow, Key>, onX: boolean) {//}: Array<Array<Cell>> {
	// for each row and column, determine how many sub rows and columns we need to split it into; this is the LCM of the counts of items in that row or column
	const xSplits = generate(xAxis.length, index => onX ? cube.map(row => row[index].length || 1).reduce(leastCommonMultiple) : 1);
	const ySplits = cube.map(row => row.map(table => onX ? 1 : table.length || 1).reduce(leastCommonMultiple));

	return reduce(ySplits, (ySplit, yIndex) => {
		const row = cube[yIndex];
		
		return generate(ySplit, nyi => {
			return reduce(xSplits, (xSplit, xIndex) => {
				const items = row[xIndex];

				return generate(xSplit, nxi => {
					return cell(items.length ? getKey(items[Math.floor(items.length * (nyi + nxi) / (xSplit * ySplit))]) : { text: '', className: 'empty' });
				});
			}, yAxis[yIndex].data.map(pair => {
				return axis(pair, 'y');
			}));
		});
	}, generate(xAxis[0].data.length, yIndex => {
		return reduce(xSplits, (xSplit, xIndex) => {
			return generate(xSplit, () => axis(xAxis[xIndex].data[yIndex], 'x'));
		}, yAxis[0].data.map(() => {
			return xy;
		}));
	}));
}

/**
 * Merge adjacent cells in a split table on the y and/or x axes.
 * @param table A table of Cells created by a previous call to splitX or splitY.
 * @param onX A flag to indicate that cells should be merged on the x axis.
 * @param onY A flag to indicate that cells should be merged on the y axis.
 */
export function merge(table: Array<Array<Cell>>, onX = true, onY = true): void {
	let next;

	for (let iY = table.length; iY--;) {
		const row = table[iY];

		for (let iX = row.length; iX--;) {
			const cell = row[iX];

			if (onY && iY && (next = table[iY - 1][iX]) && next.text === cell.text && next.className === cell.className && next.colSpan === cell.colSpan) {
				next.rowSpan += cell.rowSpan;

				row.splice(iX, 1);
			} else if (onX && iX && (next = row[iX - 1]) && next.text === cell.text && next.className === cell.className && next.rowSpan === cell.rowSpan) {
				next.colSpan += cell.colSpan;

				row.splice(iX, 1);
			}
		}
	}
}

//function expand<TSource, TResult>(source: Array<TSource>, f: (value: TSource, a: number, b: number) =)
//return reduce(ySplits, (ySplit, yIndex) => {
//	return generate(ySplit, nyi => {


/**
 * Custom version of Array.prototype.reduce that adds arrays to the seed result.
 * @hidden 
 */
function reduce<TSource, TResult>(source: Array<TSource>, expand: Func2<TSource, number, Array<TResult>>, result: Array<TResult>): Array<TResult> {
	source.forEach((value, index) => result.push(...expand(value, index)));

	return result;
}

/**
 * Generate n records.
 * @hidden
 */
function generate<TResult>(length: number, generator: Func1<number, TResult>): Array<TResult> {
	const result = [];

	for (let i = 0; i < length; i++) {
		result.push(generator(i));
	}

	return result;
}

/**
 * Returns the least common multiple of two integers
 * @hidden
 */
function leastCommonMultiple(a: number, b: number): number {
	return (a * b) / greatestCommonFactor(a, b);
}

/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
function greatestCommonFactor(a: number, b: number): number {
	return b ? greatestCommonFactor(b, a % b) : a;
}

/**
 * Creates a cell within a table, augmenting a key with row and column span detail
 * @hidden
 */
function cell(key: Key): Cell {
	return { ...key, rowSpan: 1, colSpan: 1 };
}

/**
 * Creates a cell within a table for a column or row heading.
 * @hidden 
 */
function axis(pair: { key: string, value: string }, name: string): Cell {
	return cell({ text: pair.value, className: `axis ${name} ${pair.key}` });
}

/**
 * Constant for the x/y header block
 * @hidden
 */
const xy =cell({ className: 'axis xy', text: '' });