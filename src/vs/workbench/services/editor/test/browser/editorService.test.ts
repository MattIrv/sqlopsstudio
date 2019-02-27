/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';

// {{SQL CARBON EDIT}} - Remove tests

suite('Editor service', () => {
	test('basics', function () {
	});

	test('openEditor returns NULL when opening fails or is inactive', async function () {
		const partInstantiator = workbenchInstantiationService();

		const part = partInstantiator.createInstance(EditorPart, 'id', false);
		part.create(document.createElement('div'));
		part.layout(400, 300);

		const testInstantiationService = partInstantiator.createChild(new ServiceCollection([IEditorGroupsService, part]));

		const service: EditorServiceImpl = testInstantiationService.createInstance(EditorService);

		const input = testInstantiationService.createInstance(TestEditorInput, URI.parse('my://resource-active'));
		const otherInput = testInstantiationService.createInstance(TestEditorInput, URI.parse('my://resource2-inactive'));
		const failingInput = testInstantiationService.createInstance(TestEditorInput, URI.parse('my://resource3-failing'));
		failingInput.setFailToOpen();

		await part.whenRestored;

		let editor = await service.openEditor(input, { pinned: true });
		assert.ok(editor);

		let otherEditor = await service.openEditor(otherInput, { inactive: true });
		assert.ok(!otherEditor);

		let failingEditor = await service.openEditor(failingInput);
		assert.ok(!failingEditor);
	});
});
