import TSON from "../../../src";
import { ObjectIntersection } from "../../structures/ObjectIntersection";
import { _test_assert } from "./_test_assert";

export const test_assert_object_intersection = _test_assert(
    "intersected object",
    ObjectIntersection.generate,
    (input) => TSON.assertType(input),
    ObjectIntersection.SPOILERS,
);
