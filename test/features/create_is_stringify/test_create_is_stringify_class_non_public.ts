import TSON from "../../../src";
import { ClassNonPublic } from "../../structures/ClassNonPublic";
import { _test_is_stringify } from "./../is_stringify/_test_is_stringify";

export const test_create_is_stringify_class_non_public = _test_is_stringify(
    "non-public class member",
    ClassNonPublic.generate,
    TSON.createIsStringify<ClassNonPublic>(),
    ClassNonPublic.SPOILERS,
);
