import {
  GenericHashInput,
  GenericProvable,
  GenericProvablePure,
  GenericProvableExtended,
  GenericProvableExtendedPure,
  GenericSignable,
} from './generic.js';

export {
  createDerivers,
  createHashInput,
  ProvableConstructor,
  SignableConstructor,
  NonMethods,
  InferProvable,
  InferJson,
  InferValue,
  InferredProvable,
  IsPure,
  From,
  Constructor,
};

type ProvableConstructor<Field> = <A>(
  typeObj: A,
  options?: { isPure?: boolean }
) => InferredProvable<A, Field>;
type SignableConstructor<Field> = <A>(typeObj: A) => InferredSignable<A, Field>;

let complexTypes = new Set(['object', 'function']);
let primitives = new Set([Number, String, Boolean, BigInt, null, undefined]);

function createDerivers<Field>(): {
  provable: ProvableConstructor<Field>;
  signable: SignableConstructor<Field>;
} {
  type Signable<T, TJson = JSONValue> = GenericSignable<T, TJson, Field>;
  type ProvableExtended<
    T,
    TValue = any,
    TJson = JSONValue
  > = GenericProvableExtended<T, TValue, TJson, Field>;
  type HashInput = GenericHashInput<Field>;
  const HashInput = createHashInput<Field>();

  function provable<A>(
    typeObj: A,
    options?: { isPure?: boolean }
  ): InferredProvable<A, Field> {
    type T = InferProvable<A, Field>;
    type V = InferValue<A>;
    type J = InferJson<A>;
    let objectKeys =
      typeof typeObj === 'object' && typeObj !== null
        ? Object.keys(typeObj)
        : [];

    if (!primitives.has(typeObj as any) && !complexTypes.has(typeof typeObj)) {
      throw Error(`provable: unsupported type "${typeObj}"`);
    }

    function sizeInFields(typeObj: any): number {
      if (primitives.has(typeObj)) return 0;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.map(sizeInFields).reduce((a, b) => a + b, 0);
      if ('sizeInFields' in typeObj) return typeObj.sizeInFields();
      return Object.values(typeObj)
        .map(sizeInFields)
        .reduce((a, b) => a + b, 0);
    }
    function toFields(typeObj: any, obj: any, isToplevel = false): Field[] {
      if (primitives.has(typeObj)) return [];
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.map((t, i) => toFields(t, obj[i])).flat();
      if ('toFields' in typeObj) return typeObj.toFields(obj);
      return (isToplevel ? objectKeys : Object.keys(typeObj))
        .map((k) => toFields(typeObj[k], obj[k]))
        .flat();
    }
    function toAuxiliary(typeObj: any, obj?: any, isToplevel = false): any[] {
      if (typeObj === Number) return [obj ?? 0];
      if (typeObj === String) return [obj ?? ''];
      if (typeObj === Boolean) return [obj ?? false];
      if (typeObj === BigInt) return [obj ?? 0n];
      if (typeObj === undefined || typeObj === null) return [];
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.map((t, i) => toAuxiliary(t, obj?.[i]));
      if ('toAuxiliary' in typeObj) return typeObj.toAuxiliary(obj);
      return (isToplevel ? objectKeys : Object.keys(typeObj)).map((k) =>
        toAuxiliary(typeObj[k], obj?.[k])
      );
    }

    function fromFields(
      typeObj: any,
      fields: Field[],
      aux: any[] = [],
      isToplevel = false
    ): any {
      if (
        typeObj === Number ||
        typeObj === String ||
        typeObj === Boolean ||
        typeObj === BigInt
      )
        return aux[0];
      if (typeObj === undefined || typeObj === null) return typeObj;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj)) {
        let array: any[] = [];
        let i = 0;
        let offset = 0;
        for (let subObj of typeObj) {
          let size = sizeInFields(subObj);
          array.push(
            fromFields(subObj, fields.slice(offset, offset + size), aux[i])
          );
          offset += size;
          i++;
        }
        return array;
      }
      if ('fromFields' in typeObj) return typeObj.fromFields(fields, aux);
      let keys = isToplevel ? objectKeys : Object.keys(typeObj);
      let values = fromFields(
        keys.map((k) => typeObj[k]),
        fields,
        aux
      );
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }

    function check(typeObj: any, obj: any, isToplevel = false): void {
      if (primitives.has(typeObj)) return;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.forEach((t, i) => check(t, obj[i]));
      if ('check' in typeObj) return typeObj.check(obj);
      return (isToplevel ? objectKeys : Object.keys(typeObj)).forEach((k) =>
        check(typeObj[k], obj[k])
      );
    }

    const toValue = createMap('toValue');
    const fromValue = createMap('fromValue');

    let { empty, fromJSON, toJSON, toInput } = signable(typeObj);

    type S = InferSignable<A, Field>;

    if (options?.isPure === true) {
      return {
        sizeInFields: () => sizeInFields(typeObj),
        toFields: (obj: T) => toFields(typeObj, obj, true),
        toAuxiliary: () => [],
        fromFields: (fields: Field[]) =>
          fromFields(typeObj, fields, [], true) as T,
        check: (obj: T) => check(typeObj, obj, true),
        toValue(x) {
          return toValue(typeObj, x);
        },
        fromValue(v) {
          return fromValue(typeObj, v);
        },
        toInput: (obj: T) => toInput(obj as S),
        toJSON: (obj: T) => toJSON(obj as S) satisfies J,
        fromJSON: (json: J) => fromJSON(json) as T,
        empty: () => empty() as T,
      } satisfies ProvableExtended<T, V, J> as InferredProvable<A, Field>;
    }
    return {
      sizeInFields: () => sizeInFields(typeObj),
      toFields: (obj: T) => toFields(typeObj, obj, true),
      toAuxiliary: (obj?: T) => toAuxiliary(typeObj, obj, true),
      fromFields: (fields: Field[], aux: any[]) =>
        fromFields(typeObj, fields, aux, true) as T,
      check: (obj: T) => check(typeObj, obj, true),
      toValue(x) {
        return toValue(typeObj, x);
      },
      fromValue(v) {
        return fromValue(typeObj, v);
      },
      toInput: (obj: T) => toInput(obj as S),
      toJSON: (obj: T) => toJSON(obj as S) satisfies J,
      fromJSON: (json: J) => fromJSON(json) as T,
      empty: () => empty() as T,
    } satisfies ProvableExtended<T, V, J> as InferredProvable<A, Field>;
  }

  function signable<A>(typeObj: A): InferredSignable<A, Field> {
    type T = InferSignable<A, Field>;
    type J = InferJson<A>;
    let objectKeys =
      typeof typeObj === 'object' && typeObj !== null
        ? Object.keys(typeObj)
        : [];
    let primitives = new Set([
      Number,
      String,
      Boolean,
      BigInt,
      null,
      undefined,
    ]);
    if (!primitives.has(typeObj as any) && !complexTypes.has(typeof typeObj)) {
      throw Error(`provable: unsupported type "${typeObj}"`);
    }

    function toInput(typeObj: any, obj: any, isToplevel = false): HashInput {
      if (primitives.has(typeObj)) return {};
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj)) {
        return typeObj
          .map((t, i) => toInput(t, obj[i]))
          .reduce(HashInput.append, HashInput.empty);
      }
      if ('toInput' in typeObj) return typeObj.toInput(obj) as HashInput;
      if ('toFields' in typeObj) {
        return { fields: typeObj.toFields(obj) };
      }
      return (isToplevel ? objectKeys : Object.keys(typeObj))
        .map((k) => toInput(typeObj[k], obj[k]))
        .reduce(HashInput.append, HashInput.empty);
    }
    function toJSON(typeObj: any, obj: any, isToplevel = false): JSONValue {
      if (typeObj === BigInt) return obj.toString();
      if (typeObj === String || typeObj === Number || typeObj === Boolean)
        return obj;
      if (typeObj === undefined || typeObj === null) return null;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.map((t, i) => toJSON(t, obj[i]));
      if ('toJSON' in typeObj) return typeObj.toJSON(obj);
      return Object.fromEntries(
        (isToplevel ? objectKeys : Object.keys(typeObj)).map((k) => [
          k,
          toJSON(typeObj[k], obj[k]),
        ])
      );
    }

    function fromJSON(typeObj: any, json: any, isToplevel = false): any {
      if (typeObj === BigInt) return BigInt(json as string);
      if (typeObj === String || typeObj === Number || typeObj === Boolean)
        return json;
      if (typeObj === null || typeObj === undefined) return undefined;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj))
        return typeObj.map((t, i) => fromJSON(t, json[i]));
      if ('fromJSON' in typeObj) return typeObj.fromJSON(json);
      let keys = isToplevel ? objectKeys : Object.keys(typeObj);
      let values = fromJSON(
        keys.map((k) => typeObj[k]),
        keys.map((k) => json[k])
      );
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    }

    function empty(typeObj: any): any {
      if (typeObj === Number) return 0;
      if (typeObj === String) return '';
      if (typeObj === Boolean) return false;
      if (typeObj === BigInt) return 0n;
      if (typeObj === null || typeObj === undefined) return typeObj;
      if (!complexTypes.has(typeof typeObj))
        throw Error(`provable: unsupported type "${typeObj}"`);
      if (Array.isArray(typeObj)) return typeObj.map(empty);
      if ('empty' in typeObj) return typeObj.empty();
      return Object.fromEntries(
        Object.keys(typeObj).map((k) => [k, empty(typeObj[k])])
      );
    }

    return {
      toInput: (obj: T) => toInput(typeObj, obj, true),
      toJSON: (obj: T) => toJSON(typeObj, obj, true) as J,
      fromJSON: (json: J) => fromJSON(typeObj, json, true),
      empty: () => empty(typeObj) as T,
    } satisfies Signable<T, J> as InferredSignable<A, Field>;
  }

  return { provable, signable };
}

function createMap<S extends string>(name: S) {
  function map(typeObj: any, obj: any): any {
    if (primitives.has(typeObj)) return obj;
    if (!complexTypes.has(typeof typeObj))
      throw Error(`provable: unsupported type "${typeObj}"`);
    if (Array.isArray(typeObj)) return typeObj.map((t, i) => map(t, obj[i]));
    if (name in typeObj) return typeObj[name](obj);
    return Object.fromEntries(
      Object.keys(typeObj).map((k) => [k, map(typeObj[k], obj[k])])
    );
  }
  return map;
}

function createHashInput<Field>() {
  type HashInput = GenericHashInput<Field>;
  return {
    get empty() {
      return {};
    },
    append(input1: HashInput, input2: HashInput): HashInput {
      return {
        fields: (input1.fields ?? []).concat(input2.fields ?? []),
        packed: (input1.packed ?? []).concat(input2.packed ?? []),
      };
    },
  };
}

// some type inference helpers

type JSONValue =
  | number
  | string
  | boolean
  | null
  | Array<JSONValue>
  | { [key: string]: JSONValue };

type Struct<T, Field> = GenericProvableExtended<
  NonMethods<T>,
  any,
  any,
  Field
> &
  Constructor<T> & { _isStruct: true };

type NonMethodKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonMethods<T> = Pick<T, NonMethodKeys<T>>;

type Constructor<T> = new (...args: any) => T;

type Tuple<T> = [T, ...T[]] | [];

type Primitive =
  | typeof String
  | typeof Number
  | typeof Boolean
  | typeof BigInt
  | null
  | undefined;
type InferPrimitive<P extends Primitive> = P extends typeof String
  ? string
  : P extends typeof Number
  ? number
  : P extends typeof Boolean
  ? boolean
  : P extends typeof BigInt
  ? bigint
  : P extends null
  ? null
  : P extends undefined
  ? undefined
  : any;

type InferPrimitiveValue<P extends Primitive> = P extends typeof String
  ? string
  : P extends typeof Number
  ? number
  : P extends typeof Boolean
  ? boolean
  : P extends typeof BigInt
  ? bigint
  : P extends null
  ? null
  : P extends undefined
  ? undefined
  : any;

type InferPrimitiveJson<P extends Primitive> = P extends typeof String
  ? string
  : P extends typeof Number
  ? number
  : P extends typeof Boolean
  ? boolean
  : P extends typeof BigInt
  ? string
  : P extends null
  ? null
  : P extends undefined
  ? null
  : JSONValue;

type InferProvable<A, Field> = A extends Constructor<infer U>
  ? A extends GenericProvable<U, any, Field>
    ? U
    : A extends Struct<U, Field>
    ? U
    : InferProvableBase<A, Field>
  : InferProvableBase<A, Field>;

type InferProvableBase<A, Field> = A extends GenericProvable<
  infer U,
  any,
  Field
>
  ? U
  : A extends Primitive
  ? InferPrimitive<A>
  : A extends Tuple<any>
  ? {
      [I in keyof A]: InferProvable<A[I], Field>;
    }
  : A extends (infer U)[]
  ? InferProvable<U, Field>[]
  : A extends Record<any, any>
  ? {
      [K in keyof A]: InferProvable<A[K], Field>;
    }
  : never;

type InferValue<A> = A extends GenericProvable<any, infer U, any>
  ? U
  : A extends Primitive
  ? InferPrimitiveValue<A>
  : A extends Tuple<any>
  ? {
      [I in keyof A]: InferValue<A[I]>;
    }
  : A extends (infer U)[]
  ? InferValue<U>[]
  : A extends Record<any, any>
  ? {
      [K in keyof A]: InferValue<A[K]>;
    }
  : never;

type WithJson<J> = { toJSON: (x: any) => J };

type InferJson<A> = A extends WithJson<infer J>
  ? J
  : A extends Primitive
  ? InferPrimitiveJson<A>
  : A extends Tuple<any>
  ? {
      [I in keyof A]: InferJson<A[I]>;
    }
  : A extends WithJson<infer U>[]
  ? U[]
  : A extends Record<any, any>
  ? {
      [K in keyof A]: InferJson<A[K]>;
    }
  : JSONValue;

type IsPure<A, Field> = IsPureBase<A, Field> extends true ? true : false;

type IsPureBase<A, Field> = A extends GenericProvablePure<any, any, Field>
  ? true
  : A extends GenericProvable<any, any, Field>
  ? false
  : A extends Primitive
  ? false
  : A extends (infer U)[]
  ? IsPure<U, Field>
  : A extends Record<any, any>
  ? {
      [K in keyof A]: IsPure<A[K], Field>;
    }[keyof A]
  : false;

type InferredProvable<A, Field> = IsPure<A, Field> extends true
  ? GenericProvableExtendedPure<
      InferProvable<A, Field>,
      InferValue<A>,
      InferJson<A>,
      Field
    >
  : GenericProvableExtended<
      InferProvable<A, Field>,
      InferValue<A>,
      InferJson<A>,
      Field
    >;

// signable

type InferSignable<A, Field> = A extends GenericSignable<infer U, any, Field>
  ? U
  : A extends Primitive
  ? InferPrimitive<A>
  : A extends Tuple<any>
  ? {
      [I in keyof A]: InferSignable<A[I], Field>;
    }
  : A extends (infer U)[]
  ? InferSignable<U, Field>[]
  : A extends Record<any, any>
  ? {
      [K in keyof A]: InferSignable<A[K], Field>;
    }
  : never;

type InferredSignable<A, Field> = GenericSignable<
  InferSignable<A, Field>,
  InferJson<A>,
  Field
>;

// deep union type for flexible fromValue

type From<A> = A extends {
  fromValue: (x: infer U) => any;
} & GenericProvable<any, any, any>
  ? U | InferProvable<A, any>
  : A extends GenericProvable<any, any, any>
  ? InferProvable<A, any> | InferValue<A>
  : A extends Primitive
  ? InferPrimitiveValue<A>
  : A extends Tuple<any>
  ? {
      [I in keyof A]: From<A[I]>;
    }
  : A extends (infer U)[]
  ? From<U>[]
  : A extends Record<any, any>
  ? {
      [K in keyof A]: From<A[K]>;
    }
  : never;
