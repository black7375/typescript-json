import { Escaper } from "../../../src/utils/Escaper";

import { TypeGuardError } from "../../../src";

export function _test_assert_equals<T>(
    name: string,
    generator: () => T,
    assert: (input: T) => T,
    spoil: boolean = true,
): () => void {
    return () => {
        const input: T = generator();

        // EXACT TYPE
        try {
            const output: T = assert(input);
            if (input !== output)
                throw new Error(
                    "Bug on TSON.assertEquals(): failed to return input value.",
                );
        } catch (exp) {
            if (exp instanceof TypeGuardError) {
                throw new Error(
                    `Bug on TSON.assertEquals(): failed to understand the ${name} type.`,
                );
            } else throw exp;
        }

        // WRONG TYPES
        const accessors: IAccessor[] = [];
        trace(accessors, "$input", input);

        if (spoil === false) return;

        // SPOIL PROPERTIES
        for (const { path, value } of accessors) {
            const variable: boolean = Math.random() < 0.5;
            const key: string = variable
                ? "non_regular_type"
                : "non-regular-type";
            const fullPath: string = variable
                ? `${path}.${key}`
                : `${path}["${key}"]`;

            value[key] = key;

            try {
                assert(input);
                throw new Error(
                    `Bug on TSON.assertEquals(): failed to detect surplus property on the ${name} type.`,
                );
            } catch (exp) {
                if (
                    exp instanceof TypeGuardError &&
                    exp.method === "TSON.assertEquals" &&
                    exp.path === fullPath &&
                    exp.expected === "undefined" &&
                    exp.value === key
                ) {
                    delete value[key];
                    continue;
                } else if (exp instanceof TypeGuardError) {
                    console.log({
                        method: exp.method,
                        path: exp.path,
                        full: fullPath,
                        expected: exp.expected,
                    });
                    throw new Error(
                        `Bug on TSON.assertEquals(): failed to detect surplus property on the ${name} type.`,
                    );
                } else throw exp;
            }
        }
    };
}

function trace(accessors: IAccessor[], path: string, input: any): void {
    if (Array.isArray(input)) trace_array(accessors, path, input);
    else if (typeof input === "object" && input !== null)
        trace_object(accessors, path, input);
}

function trace_object(accessors: IAccessor[], path: string, obj: any): void {
    accessors.push({
        path,
        value: obj,
    });
    for (const [key, value] of Object.entries(obj))
        trace(
            accessors,
            Escaper.variable(key)
                ? `${path}.${key}`
                : `${path}[${JSON.stringify(key)}]`,
            value,
        );
}

function trace_array(accessors: IAccessor[], path: string, array: any[]): void {
    array.forEach((elem, i) => trace(accessors, `${path}[${i}]`, elem));
}

interface IAccessor {
    path: string;
    value: any;
}
