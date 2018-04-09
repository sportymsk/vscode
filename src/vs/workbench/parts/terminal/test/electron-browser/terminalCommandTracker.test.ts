/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as assert from 'assert';
import { Terminal } from 'vscode-xterm';
import { TerminalCommandTracker } from 'vs/workbench/parts/terminal/node/terminalCommandTracker';

function createKeyEvent(keyCode: number): KeyboardEvent {
	return <KeyboardEvent>{
		preventDefault: () => { },
		stopPropagation: () => { },
		type: 'key',
		keyCode
	};
}

interface TestTerminal extends Terminal {
	_keyDown(event: KeyboardEvent): void;
}

suite('Workbench - TerminalCommandTracker', () => {
	let xterm: TestTerminal;
	let commandTracker: TerminalCommandTracker;

	setup(() => {
		// fixture = document.body;
		const container = document.createElement('div');
		xterm = (<TestTerminal>new Terminal({
			cols: 10,
			rows: 10
		}));
		// (<any>window).matchMedia = () => {};
		// xterm.open(container);
		(<any>xterm)._compositionHelper = {
			keydown: () => true
		};
		for (let i = 1; i < 10; i++) {
			xterm.write(`${i}\r`);
		}
		commandTracker = new TerminalCommandTracker(xterm);
	});

	suite('Command tracking', () => {
		test('should track commands when the prompt is of sufficient size', () => {
			assert.equal(xterm.markers.length, 0);
			xterm.write('123');
			xterm._keyDown(createKeyEvent(13));
			assert.equal(xterm.markers.length, 1);
		});
	});

	suite('selectToPreviousCommand', () => {
		test('should select to the previous command', () => {
			commandTracker.scrollToPreviousCommand();
			// assert.equal(marker1.line, 0);
		});
	});
});