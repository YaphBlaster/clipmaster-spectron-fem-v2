const assert = require("assert");
const path = require("path");
const Application = require("spectron").Application;
const electronPath = require("electron");

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, "..")],
});

describe("Clipmaster 9000", function () {
  this.timeout(10000);

  beforeEach(() => {
    return app.start();
  });

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it("shows an initial window", async () => {
    // We'll do this one together.
    const count = await app.client.getWindowCount();
    return assert.strictEqual(count, 1);
  });

  it("has the correct title", async () => {
    // We'll do this one together.
    const title = await app.client.waitUntilWindowLoaded().getTitle();
    return assert.strictEqual(title, "Clipmaster 9000");
  });

  it("does not have the developer tools open", async () => {
    // We'll do this one together.
    const devToolsAreOpen = await app.client
      .waitUntilWindowLoaded()
      .browserWindow.isDevToolsOpened();
    return assert.strictEqual(devToolsAreOpen, false);
  });

  it('has a button with the text "Copy from Clipboard"', async () => {
    // We'll do this one together.
    const buttonText = await app.client.getText("#copy-from-clipboard");
    return assert.strictEqual(buttonText, "Copy from Clipboard");
  });

  it("should not have any clippings when the application starts up", async () => {
    // We'll do this one together.
    await app.client.waitUntilWindowLoaded();
    const clippings = await app.client.$$(".clippings-list-item");
    return assert.strictEqual(clippings.length, 0);
  });

  it('should have one clipping when the "Copy From Clipboard" button has been pressed', async () => {
    /*
     * Independent Exercise!
     *
     * - Click on the #copy-from-clipboard button.
     * - Verify that there is now one .clippings-list-item element
     *   on the page.
     */
    await app.client.waitUntilWindowLoaded();
    await app.client.click("#copy-from-clipboard");
    const clippings = await app.client.$$(".clippings-list-item");
    return assert.strictEqual(clippings.length, 1);
  });

  it("should successfully remove a clipping", async () => {
    // We'll do this one together.
    await app.client.waitUntilWindowLoaded();
    await app.client
      .click("#copy-from-clipboard")
      .moveToObject(".clippings-list-item")
      .click(".remove-clipping");
    const clippings = await app.client.$$(".clippings-list-item");
    return assert.strictEqual(clippings.length, 0);
  });

  it("should have the correct text in a new clipping", async () => {
    /*
     * Independent Exercise!
     *
     * - Write a test that adds some text to the system clipboard.
     * - Click on the "Copy to Clipboard" button.
     * - Get the text from the .clipping-text element.
     * - Assert that the text in the field is the same as what you
     *   wrote to the clipboard.
     *
     * Hint—You can write text to the clipboard using:
     *   app.electron.clipboard.writeText('Vegan Ham');
     */
    await app.client.waitUntilWindowLoaded();
    await app.electron.clipboard.writeText("vegan ham");
    await app.client.click("#copy-from-clipboard");
    const clippingText = await app.client.getText(".clipping-text");
    return assert.strictEqual(clippingText, "vegan ham");
  });

  it("it should write the text of the clipping to the clipboard", async () => {
    /*
     * Independent Exercise!
     *
     * In this test, we want to make sure that Clipmaster replaces whatever is
     * already on a the clipboard. We'll implement the following steps.
     *
     * - Write a string of text to the clipboard.
     * - Click "Copy from Clipboard"
     * - Write something else to the clipboard.
     * - Click the .copy-clippling element that was created when you added
     *   the first string to Clipmaster
     * - Assert that the clipboard currently contains that first string using
     *   `app.electron.clipboard.readText()`.
     *
     */
    await app.client.waitUntilWindowLoaded();
    await app.electron.clipboard.writeText("vegan ham");
    await app.client.click("#copy-from-clipboard");
    await app.electron.clipboard.writeText("something totally different");
    await app.client.click(".copy-clipping");

    const clippingText = await app.client.getText(".clipping-text");
    return assert.strictEqual(clippingText, "vegan ham");
  });
});
