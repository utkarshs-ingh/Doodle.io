let expect = require('expect');

var generateMessage = require('./message');

describe('Geneate Message', () => {
    it("should generate message object", () => {
        let from = "Test man",
        text = "Dummy message",
        message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
    });
});
