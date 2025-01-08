import { queryParser } from "../../utils/queryParser.js";
import test, { suite } from "node:test";
import { assert } from "chai";

suite("suite of unit tests", () => {
  test("query parser function throws an error if url is not passed", () => {
    assert.throws(
      () => queryParser(null),
      "Expected a string as the URL to parse"
    );
  });
});
