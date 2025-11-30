/**
 * Client
 **/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Setting
 *
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>;
/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model UserPaperlessInstanceAccess
 *
 */
export type UserPaperlessInstanceAccess =
  $Result.DefaultSelection<Prisma.$UserPaperlessInstanceAccessPayload>;
/**
 * Model UserAiProviderAccess
 *
 */
export type UserAiProviderAccess = $Result.DefaultSelection<Prisma.$UserAiProviderAccessPayload>;
/**
 * Model UserAiBotAccess
 *
 */
export type UserAiBotAccess = $Result.DefaultSelection<Prisma.$UserAiBotAccessPayload>;
/**
 * Model PaperlessInstance
 *
 */
export type PaperlessInstance = $Result.DefaultSelection<Prisma.$PaperlessInstancePayload>;
/**
 * Model AiProvider
 *
 */
export type AiProvider = $Result.DefaultSelection<Prisma.$AiProviderPayload>;
/**
 * Model AiBot
 *
 */
export type AiBot = $Result.DefaultSelection<Prisma.$AiBotPayload>;
/**
 * Model ProcessedDocument
 *
 */
export type ProcessedDocument = $Result.DefaultSelection<Prisma.$ProcessedDocumentPayload>;
/**
 * Model ProcessingQueue
 *
 */
export type ProcessingQueue = $Result.DefaultSelection<Prisma.$ProcessingQueuePayload>;
/**
 * Model AiUsageMetric
 *
 */
export type AiUsageMetric = $Result.DefaultSelection<Prisma.$AiUsageMetricPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
    DEFAULT: 'DEFAULT';
    ADMIN: 'ADMIN';
  };

  export type UserRole = (typeof UserRole)[keyof typeof UserRole];

  export const Permission: {
    READ: 'READ';
    WRITE: 'WRITE';
    ADMIN: 'ADMIN';
  };

  export type Permission = (typeof Permission)[keyof typeof Permission];
}

export type UserRole = $Enums.UserRole;

export const UserRole: typeof $Enums.UserRole;

export type Permission = $Enums.Permission;

export const Permission: typeof $Enums.Permission;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Settings
 * const settings = await prisma.setting.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Settings
   * const settings = await prisma.setting.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Settings
   * const settings = await prisma.setting.findMany()
   * ```
   */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPaperlessInstanceAccess`: Exposes CRUD operations for the **UserPaperlessInstanceAccess** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserPaperlessInstanceAccesses
   * const userPaperlessInstanceAccesses = await prisma.userPaperlessInstanceAccess.findMany()
   * ```
   */
  get userPaperlessInstanceAccess(): Prisma.UserPaperlessInstanceAccessDelegate<
    ExtArgs,
    ClientOptions
  >;

  /**
   * `prisma.userAiProviderAccess`: Exposes CRUD operations for the **UserAiProviderAccess** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserAiProviderAccesses
   * const userAiProviderAccesses = await prisma.userAiProviderAccess.findMany()
   * ```
   */
  get userAiProviderAccess(): Prisma.UserAiProviderAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAiBotAccess`: Exposes CRUD operations for the **UserAiBotAccess** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more UserAiBotAccesses
   * const userAiBotAccesses = await prisma.userAiBotAccess.findMany()
   * ```
   */
  get userAiBotAccess(): Prisma.UserAiBotAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paperlessInstance`: Exposes CRUD operations for the **PaperlessInstance** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PaperlessInstances
   * const paperlessInstances = await prisma.paperlessInstance.findMany()
   * ```
   */
  get paperlessInstance(): Prisma.PaperlessInstanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiProvider`: Exposes CRUD operations for the **AiProvider** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AiProviders
   * const aiProviders = await prisma.aiProvider.findMany()
   * ```
   */
  get aiProvider(): Prisma.AiProviderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiBot`: Exposes CRUD operations for the **AiBot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AiBots
   * const aiBots = await prisma.aiBot.findMany()
   * ```
   */
  get aiBot(): Prisma.AiBotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.processedDocument`: Exposes CRUD operations for the **ProcessedDocument** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProcessedDocuments
   * const processedDocuments = await prisma.processedDocument.findMany()
   * ```
   */
  get processedDocument(): Prisma.ProcessedDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.processingQueue`: Exposes CRUD operations for the **ProcessingQueue** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProcessingQueues
   * const processingQueues = await prisma.processingQueue.findMany()
   * ```
   */
  get processingQueue(): Prisma.ProcessingQueueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiUsageMetric`: Exposes CRUD operations for the **AiUsageMetric** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AiUsageMetrics
   * const aiUsageMetrics = await prisma.aiUsageMetric.findMany()
   * ```
   */
  get aiUsageMetric(): Prisma.AiUsageMetricDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 7.0.0
   * Query Engine version: 0c19ccc313cf9911a90d99d2ac2eb0280c76c513
   */
  export type PrismaVersion = {
    client: string;
    engine: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Setting: 'Setting';
    User: 'User';
    UserPaperlessInstanceAccess: 'UserPaperlessInstanceAccess';
    UserAiProviderAccess: 'UserAiProviderAccess';
    UserAiBotAccess: 'UserAiBotAccess';
    PaperlessInstance: 'PaperlessInstance';
    AiProvider: 'AiProvider';
    AiBot: 'AiBot';
    ProcessedDocument: 'ProcessedDocument';
    ProcessingQueue: 'ProcessingQueue';
    AiUsageMetric: 'AiUsageMetric';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'setting'
        | 'user'
        | 'userPaperlessInstanceAccess'
        | 'userAiProviderAccess'
        | 'userAiBotAccess'
        | 'paperlessInstance'
        | 'aiProvider'
        | 'aiBot'
        | 'processedDocument'
        | 'processingQueue'
        | 'aiUsageMetric';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>;
        fields: Prisma.SettingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[];
          };
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[];
          };
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.SettingUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[];
          };
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>;
          };
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSetting>;
          };
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SettingGroupByOutputType>[];
          };
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>;
            result: $Utils.Optional<SettingCountAggregateOutputType> | number;
          };
        };
      };
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      UserPaperlessInstanceAccess: {
        payload: Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>;
        fields: Prisma.UserPaperlessInstanceAccessFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserPaperlessInstanceAccessFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserPaperlessInstanceAccessFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          findFirst: {
            args: Prisma.UserPaperlessInstanceAccessFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserPaperlessInstanceAccessFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          findMany: {
            args: Prisma.UserPaperlessInstanceAccessFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>[];
          };
          create: {
            args: Prisma.UserPaperlessInstanceAccessCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          createMany: {
            args: Prisma.UserPaperlessInstanceAccessCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserPaperlessInstanceAccessCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>[];
          };
          delete: {
            args: Prisma.UserPaperlessInstanceAccessDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          update: {
            args: Prisma.UserPaperlessInstanceAccessUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          deleteMany: {
            args: Prisma.UserPaperlessInstanceAccessDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserPaperlessInstanceAccessUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserPaperlessInstanceAccessUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>[];
          };
          upsert: {
            args: Prisma.UserPaperlessInstanceAccessUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPaperlessInstanceAccessPayload>;
          };
          aggregate: {
            args: Prisma.UserPaperlessInstanceAccessAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUserPaperlessInstanceAccess>;
          };
          groupBy: {
            args: Prisma.UserPaperlessInstanceAccessGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserPaperlessInstanceAccessGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserPaperlessInstanceAccessCountArgs<ExtArgs>;
            result: $Utils.Optional<UserPaperlessInstanceAccessCountAggregateOutputType> | number;
          };
        };
      };
      UserAiProviderAccess: {
        payload: Prisma.$UserAiProviderAccessPayload<ExtArgs>;
        fields: Prisma.UserAiProviderAccessFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserAiProviderAccessFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserAiProviderAccessFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          findFirst: {
            args: Prisma.UserAiProviderAccessFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserAiProviderAccessFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          findMany: {
            args: Prisma.UserAiProviderAccessFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>[];
          };
          create: {
            args: Prisma.UserAiProviderAccessCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          createMany: {
            args: Prisma.UserAiProviderAccessCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserAiProviderAccessCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>[];
          };
          delete: {
            args: Prisma.UserAiProviderAccessDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          update: {
            args: Prisma.UserAiProviderAccessUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          deleteMany: {
            args: Prisma.UserAiProviderAccessDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserAiProviderAccessUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserAiProviderAccessUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>[];
          };
          upsert: {
            args: Prisma.UserAiProviderAccessUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiProviderAccessPayload>;
          };
          aggregate: {
            args: Prisma.UserAiProviderAccessAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUserAiProviderAccess>;
          };
          groupBy: {
            args: Prisma.UserAiProviderAccessGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserAiProviderAccessGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserAiProviderAccessCountArgs<ExtArgs>;
            result: $Utils.Optional<UserAiProviderAccessCountAggregateOutputType> | number;
          };
        };
      };
      UserAiBotAccess: {
        payload: Prisma.$UserAiBotAccessPayload<ExtArgs>;
        fields: Prisma.UserAiBotAccessFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserAiBotAccessFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserAiBotAccessFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          findFirst: {
            args: Prisma.UserAiBotAccessFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserAiBotAccessFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          findMany: {
            args: Prisma.UserAiBotAccessFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>[];
          };
          create: {
            args: Prisma.UserAiBotAccessCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          createMany: {
            args: Prisma.UserAiBotAccessCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserAiBotAccessCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>[];
          };
          delete: {
            args: Prisma.UserAiBotAccessDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          update: {
            args: Prisma.UserAiBotAccessUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          deleteMany: {
            args: Prisma.UserAiBotAccessDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserAiBotAccessUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserAiBotAccessUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>[];
          };
          upsert: {
            args: Prisma.UserAiBotAccessUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserAiBotAccessPayload>;
          };
          aggregate: {
            args: Prisma.UserAiBotAccessAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUserAiBotAccess>;
          };
          groupBy: {
            args: Prisma.UserAiBotAccessGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserAiBotAccessGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserAiBotAccessCountArgs<ExtArgs>;
            result: $Utils.Optional<UserAiBotAccessCountAggregateOutputType> | number;
          };
        };
      };
      PaperlessInstance: {
        payload: Prisma.$PaperlessInstancePayload<ExtArgs>;
        fields: Prisma.PaperlessInstanceFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PaperlessInstanceFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PaperlessInstanceFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          findFirst: {
            args: Prisma.PaperlessInstanceFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PaperlessInstanceFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          findMany: {
            args: Prisma.PaperlessInstanceFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>[];
          };
          create: {
            args: Prisma.PaperlessInstanceCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          createMany: {
            args: Prisma.PaperlessInstanceCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PaperlessInstanceCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>[];
          };
          delete: {
            args: Prisma.PaperlessInstanceDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          update: {
            args: Prisma.PaperlessInstanceUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          deleteMany: {
            args: Prisma.PaperlessInstanceDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PaperlessInstanceUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PaperlessInstanceUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>[];
          };
          upsert: {
            args: Prisma.PaperlessInstanceUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaperlessInstancePayload>;
          };
          aggregate: {
            args: Prisma.PaperlessInstanceAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePaperlessInstance>;
          };
          groupBy: {
            args: Prisma.PaperlessInstanceGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PaperlessInstanceGroupByOutputType>[];
          };
          count: {
            args: Prisma.PaperlessInstanceCountArgs<ExtArgs>;
            result: $Utils.Optional<PaperlessInstanceCountAggregateOutputType> | number;
          };
        };
      };
      AiProvider: {
        payload: Prisma.$AiProviderPayload<ExtArgs>;
        fields: Prisma.AiProviderFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AiProviderFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AiProviderFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          findFirst: {
            args: Prisma.AiProviderFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AiProviderFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          findMany: {
            args: Prisma.AiProviderFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>[];
          };
          create: {
            args: Prisma.AiProviderCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          createMany: {
            args: Prisma.AiProviderCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AiProviderCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>[];
          };
          delete: {
            args: Prisma.AiProviderDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          update: {
            args: Prisma.AiProviderUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          deleteMany: {
            args: Prisma.AiProviderDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AiProviderUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AiProviderUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>[];
          };
          upsert: {
            args: Prisma.AiProviderUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiProviderPayload>;
          };
          aggregate: {
            args: Prisma.AiProviderAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAiProvider>;
          };
          groupBy: {
            args: Prisma.AiProviderGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AiProviderGroupByOutputType>[];
          };
          count: {
            args: Prisma.AiProviderCountArgs<ExtArgs>;
            result: $Utils.Optional<AiProviderCountAggregateOutputType> | number;
          };
        };
      };
      AiBot: {
        payload: Prisma.$AiBotPayload<ExtArgs>;
        fields: Prisma.AiBotFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AiBotFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AiBotFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          findFirst: {
            args: Prisma.AiBotFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AiBotFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          findMany: {
            args: Prisma.AiBotFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>[];
          };
          create: {
            args: Prisma.AiBotCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          createMany: {
            args: Prisma.AiBotCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AiBotCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>[];
          };
          delete: {
            args: Prisma.AiBotDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          update: {
            args: Prisma.AiBotUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          deleteMany: {
            args: Prisma.AiBotDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AiBotUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AiBotUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>[];
          };
          upsert: {
            args: Prisma.AiBotUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiBotPayload>;
          };
          aggregate: {
            args: Prisma.AiBotAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAiBot>;
          };
          groupBy: {
            args: Prisma.AiBotGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AiBotGroupByOutputType>[];
          };
          count: {
            args: Prisma.AiBotCountArgs<ExtArgs>;
            result: $Utils.Optional<AiBotCountAggregateOutputType> | number;
          };
        };
      };
      ProcessedDocument: {
        payload: Prisma.$ProcessedDocumentPayload<ExtArgs>;
        fields: Prisma.ProcessedDocumentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProcessedDocumentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProcessedDocumentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          findFirst: {
            args: Prisma.ProcessedDocumentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProcessedDocumentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          findMany: {
            args: Prisma.ProcessedDocumentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>[];
          };
          create: {
            args: Prisma.ProcessedDocumentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          createMany: {
            args: Prisma.ProcessedDocumentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProcessedDocumentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>[];
          };
          delete: {
            args: Prisma.ProcessedDocumentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          update: {
            args: Prisma.ProcessedDocumentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          deleteMany: {
            args: Prisma.ProcessedDocumentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProcessedDocumentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ProcessedDocumentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>[];
          };
          upsert: {
            args: Prisma.ProcessedDocumentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessedDocumentPayload>;
          };
          aggregate: {
            args: Prisma.ProcessedDocumentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProcessedDocument>;
          };
          groupBy: {
            args: Prisma.ProcessedDocumentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProcessedDocumentGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProcessedDocumentCountArgs<ExtArgs>;
            result: $Utils.Optional<ProcessedDocumentCountAggregateOutputType> | number;
          };
        };
      };
      ProcessingQueue: {
        payload: Prisma.$ProcessingQueuePayload<ExtArgs>;
        fields: Prisma.ProcessingQueueFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProcessingQueueFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProcessingQueueFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          findFirst: {
            args: Prisma.ProcessingQueueFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProcessingQueueFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          findMany: {
            args: Prisma.ProcessingQueueFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>[];
          };
          create: {
            args: Prisma.ProcessingQueueCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          createMany: {
            args: Prisma.ProcessingQueueCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProcessingQueueCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>[];
          };
          delete: {
            args: Prisma.ProcessingQueueDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          update: {
            args: Prisma.ProcessingQueueUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          deleteMany: {
            args: Prisma.ProcessingQueueDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProcessingQueueUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ProcessingQueueUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>[];
          };
          upsert: {
            args: Prisma.ProcessingQueueUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProcessingQueuePayload>;
          };
          aggregate: {
            args: Prisma.ProcessingQueueAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProcessingQueue>;
          };
          groupBy: {
            args: Prisma.ProcessingQueueGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProcessingQueueGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProcessingQueueCountArgs<ExtArgs>;
            result: $Utils.Optional<ProcessingQueueCountAggregateOutputType> | number;
          };
        };
      };
      AiUsageMetric: {
        payload: Prisma.$AiUsageMetricPayload<ExtArgs>;
        fields: Prisma.AiUsageMetricFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AiUsageMetricFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AiUsageMetricFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          findFirst: {
            args: Prisma.AiUsageMetricFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AiUsageMetricFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          findMany: {
            args: Prisma.AiUsageMetricFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[];
          };
          create: {
            args: Prisma.AiUsageMetricCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          createMany: {
            args: Prisma.AiUsageMetricCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AiUsageMetricCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[];
          };
          delete: {
            args: Prisma.AiUsageMetricDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          update: {
            args: Prisma.AiUsageMetricUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          deleteMany: {
            args: Prisma.AiUsageMetricDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AiUsageMetricUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AiUsageMetricUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[];
          };
          upsert: {
            args: Prisma.AiUsageMetricUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>;
          };
          aggregate: {
            args: Prisma.AiUsageMetricAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAiUsageMetric>;
          };
          groupBy: {
            args: Prisma.AiUsageMetricGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AiUsageMetricGroupByOutputType>[];
          };
          count: {
            args: Prisma.AiUsageMetricCountArgs<ExtArgs>;
            result: $Utils.Optional<AiUsageMetricCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory;
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    setting?: SettingOmit;
    user?: UserOmit;
    userPaperlessInstanceAccess?: UserPaperlessInstanceAccessOmit;
    userAiProviderAccess?: UserAiProviderAccessOmit;
    userAiBotAccess?: UserAiBotAccessOmit;
    paperlessInstance?: PaperlessInstanceOmit;
    aiProvider?: AiProviderOmit;
    aiBot?: AiBotOmit;
    processedDocument?: ProcessedDocumentOmit;
    processingQueue?: ProcessingQueueOmit;
    aiUsageMetric?: AiUsageMetricOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedPaperlessInstances: number;
    ownedAiProviders: number;
    ownedAiBots: number;
    sharedPaperlessInstances: number;
    sharedAiProviders: number;
    sharedAiBots: number;
    aiUsageMetrics: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    ownedPaperlessInstances?: boolean | UserCountOutputTypeCountOwnedPaperlessInstancesArgs;
    ownedAiProviders?: boolean | UserCountOutputTypeCountOwnedAiProvidersArgs;
    ownedAiBots?: boolean | UserCountOutputTypeCountOwnedAiBotsArgs;
    sharedPaperlessInstances?: boolean | UserCountOutputTypeCountSharedPaperlessInstancesArgs;
    sharedAiProviders?: boolean | UserCountOutputTypeCountSharedAiProvidersArgs;
    sharedAiBots?: boolean | UserCountOutputTypeCountSharedAiBotsArgs;
    aiUsageMetrics?: boolean | UserCountOutputTypeCountAiUsageMetricsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedPaperlessInstancesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PaperlessInstanceWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedAiProvidersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiProviderWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedAiBotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiBotWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedPaperlessInstancesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserPaperlessInstanceAccessWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedAiProvidersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiProviderAccessWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedAiBotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiBotAccessWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAiUsageMetricsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiUsageMetricWhereInput;
  };

  /**
   * Count Type PaperlessInstanceCountOutputType
   */

  export type PaperlessInstanceCountOutputType = {
    sharedWith: number;
    processedDocuments: number;
    processingQueue: number;
  };

  export type PaperlessInstanceCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sharedWith?: boolean | PaperlessInstanceCountOutputTypeCountSharedWithArgs;
    processedDocuments?: boolean | PaperlessInstanceCountOutputTypeCountProcessedDocumentsArgs;
    processingQueue?: boolean | PaperlessInstanceCountOutputTypeCountProcessingQueueArgs;
  };

  // Custom InputTypes
  /**
   * PaperlessInstanceCountOutputType without action
   */
  export type PaperlessInstanceCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstanceCountOutputType
     */
    select?: PaperlessInstanceCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * PaperlessInstanceCountOutputType without action
   */
  export type PaperlessInstanceCountOutputTypeCountSharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserPaperlessInstanceAccessWhereInput;
  };

  /**
   * PaperlessInstanceCountOutputType without action
   */
  export type PaperlessInstanceCountOutputTypeCountProcessedDocumentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProcessedDocumentWhereInput;
  };

  /**
   * PaperlessInstanceCountOutputType without action
   */
  export type PaperlessInstanceCountOutputTypeCountProcessingQueueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProcessingQueueWhereInput;
  };

  /**
   * Count Type AiProviderCountOutputType
   */

  export type AiProviderCountOutputType = {
    sharedWith: number;
    bots: number;
  };

  export type AiProviderCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sharedWith?: boolean | AiProviderCountOutputTypeCountSharedWithArgs;
    bots?: boolean | AiProviderCountOutputTypeCountBotsArgs;
  };

  // Custom InputTypes
  /**
   * AiProviderCountOutputType without action
   */
  export type AiProviderCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProviderCountOutputType
     */
    select?: AiProviderCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AiProviderCountOutputType without action
   */
  export type AiProviderCountOutputTypeCountSharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiProviderAccessWhereInput;
  };

  /**
   * AiProviderCountOutputType without action
   */
  export type AiProviderCountOutputTypeCountBotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiBotWhereInput;
  };

  /**
   * Count Type AiBotCountOutputType
   */

  export type AiBotCountOutputType = {
    sharedWith: number;
    aiUsageMetrics: number;
  };

  export type AiBotCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sharedWith?: boolean | AiBotCountOutputTypeCountSharedWithArgs;
    aiUsageMetrics?: boolean | AiBotCountOutputTypeCountAiUsageMetricsArgs;
  };

  // Custom InputTypes
  /**
   * AiBotCountOutputType without action
   */
  export type AiBotCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBotCountOutputType
     */
    select?: AiBotCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AiBotCountOutputType without action
   */
  export type AiBotCountOutputTypeCountSharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiBotAccessWhereInput;
  };

  /**
   * AiBotCountOutputType without action
   */
  export type AiBotCountOutputTypeCountAiUsageMetricsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiUsageMetricWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null;
    _min: SettingMinAggregateOutputType | null;
    _max: SettingMaxAggregateOutputType | null;
  };

  export type SettingMinAggregateOutputType = {
    settingKey: string | null;
    settingValue: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type SettingMaxAggregateOutputType = {
    settingKey: string | null;
    settingValue: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type SettingCountAggregateOutputType = {
    settingKey: number;
    settingValue: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type SettingMinAggregateInputType = {
    settingKey?: true;
    settingValue?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type SettingMaxAggregateInputType = {
    settingKey?: true;
    settingValue?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type SettingCountAggregateInputType = {
    settingKey?: true;
    settingValue?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type SettingAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Settings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Settings
     **/
    _count?: true | SettingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SettingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SettingMaxAggregateInputType;
  };

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
    [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>;
  };

  export type SettingGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SettingWhereInput;
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[];
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum;
    having?: SettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SettingCountAggregateInputType | true;
    _min?: SettingMinAggregateInputType;
    _max?: SettingMaxAggregateInputType;
  };

  export type SettingGroupByOutputType = {
    settingKey: string;
    settingValue: string;
    createdAt: Date;
    updatedAt: Date;
    _count: SettingCountAggregateOutputType | null;
    _min: SettingMinAggregateOutputType | null;
    _max: SettingMaxAggregateOutputType | null;
  };

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SettingGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
          : GetScalarType<T[P], SettingGroupByOutputType[P]>;
      }
    >
  >;

  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        settingKey?: boolean;
        settingValue?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
      },
      ExtArgs['result']['setting']
    >;

  export type SettingSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      settingKey?: boolean;
      settingValue?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['setting']
  >;

  export type SettingSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      settingKey?: boolean;
      settingValue?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['setting']
  >;

  export type SettingSelectScalar = {
    settingKey?: boolean;
    settingValue?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'settingKey' | 'settingValue' | 'createdAt' | 'updatedAt',
      ExtArgs['result']['setting']
    >;

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Setting';
      objects: {};
      scalars: $Extensions.GetPayloadResult<
        {
          settingKey: string;
          settingValue: string;
          createdAt: Date;
          updatedAt: Date;
        },
        ExtArgs['result']['setting']
      >;
      composites: {};
    };

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> =
    $Result.GetResult<Prisma.$SettingPayload, S>;

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SettingFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: SettingCountAggregateInputType | true;
  };

  export interface SettingDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting']; meta: { name: 'Setting' } };
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(
      args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(
      args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     *
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     *
     * // Only select the `settingKey`
     * const settingWithSettingKeyOnly = await prisma.setting.findMany({ select: { settingKey: true } })
     *
     */
    findMany<T extends SettingFindManyArgs>(
      args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     *
     */
    create<T extends SettingCreateArgs>(
      args: SelectSubset<T, SettingCreateArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SettingCreateManyArgs>(
      args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Settings and only return the `settingKey`
     * const settingWithSettingKeyOnly = await prisma.setting.createManyAndReturn({
     *   select: { settingKey: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SettingPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     *
     */
    delete<T extends SettingDeleteArgs>(
      args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SettingUpdateArgs>(
      args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SettingDeleteManyArgs>(
      args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SettingUpdateManyArgs>(
      args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Settings and only return the `settingKey`
     * const settingWithSettingKeyOnly = await prisma.setting.updateManyAndReturn({
     *   select: { settingKey: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SettingUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SettingUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SettingPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(
      args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>
    ): Prisma__SettingClient<
      $Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
     **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SettingAggregateArgs>(
      args: Subset<T, SettingAggregateArgs>
    ): Prisma.PrismaPromise<GetSettingAggregateType<T>>;

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Setting model
     */
    readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly settingKey: FieldRef<'Setting', 'String'>;
    readonly settingValue: FieldRef<'Setting', 'String'>;
    readonly createdAt: FieldRef<'Setting', 'DateTime'>;
    readonly updatedAt: FieldRef<'Setting', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput;
  };

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput;
  };

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Settings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[];
  };

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Settings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[];
  };

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Settings.
     */
    skip?: number;
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[];
  };

  /**
   * Setting create
   */
  export type SettingCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>;
  };

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Setting update
   */
  export type SettingUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>;
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput;
  };

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>;
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput;
    /**
     * Limit how many Settings to update.
     */
    limit?: number;
  };

  /**
   * Setting updateManyAndReturn
   */
  export type SettingUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>;
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput;
    /**
     * Limit how many Settings to update.
     */
    limit?: number;
  };

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput;
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>;
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>;
  };

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput;
  };

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput;
    /**
     * Limit how many Settings to delete.
     */
    limit?: number;
  };

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null;
  };

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    username: string | null;
    passwordHash: string | null;
    role: $Enums.UserRole | null;
    mustChangePassword: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    username: string | null;
    passwordHash: string | null;
    role: $Enums.UserRole | null;
    mustChangePassword: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    username: number;
    passwordHash: number;
    role: number;
    mustChangePassword: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    username?: true;
    passwordHash?: true;
    role?: true;
    mustChangePassword?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    username?: true;
    passwordHash?: true;
    role?: true;
    mustChangePassword?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    username?: true;
    passwordHash?: true;
    role?: true;
    mustChangePassword?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: UserWhereInput;
      orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
    };

  export type UserGroupByOutputType = {
    id: string;
    username: string;
    passwordHash: string;
    role: $Enums.UserRole;
    mustChangePassword: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        username?: boolean;
        passwordHash?: boolean;
        role?: boolean;
        mustChangePassword?: boolean;
        isActive?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        ownedPaperlessInstances?: boolean | User$ownedPaperlessInstancesArgs<ExtArgs>;
        ownedAiProviders?: boolean | User$ownedAiProvidersArgs<ExtArgs>;
        ownedAiBots?: boolean | User$ownedAiBotsArgs<ExtArgs>;
        sharedPaperlessInstances?: boolean | User$sharedPaperlessInstancesArgs<ExtArgs>;
        sharedAiProviders?: boolean | User$sharedAiProvidersArgs<ExtArgs>;
        sharedAiBots?: boolean | User$sharedAiBotsArgs<ExtArgs>;
        aiUsageMetrics?: boolean | User$aiUsageMetricsArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['user']
    >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      passwordHash?: boolean;
      role?: boolean;
      mustChangePassword?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      passwordHash?: boolean;
      role?: boolean;
      mustChangePassword?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    username?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'username'
      | 'passwordHash'
      | 'role'
      | 'mustChangePassword'
      | 'isActive'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['user']
    >;
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedPaperlessInstances?: boolean | User$ownedPaperlessInstancesArgs<ExtArgs>;
    ownedAiProviders?: boolean | User$ownedAiProvidersArgs<ExtArgs>;
    ownedAiBots?: boolean | User$ownedAiBotsArgs<ExtArgs>;
    sharedPaperlessInstances?: boolean | User$sharedPaperlessInstancesArgs<ExtArgs>;
    sharedAiProviders?: boolean | User$sharedAiProvidersArgs<ExtArgs>;
    sharedAiBots?: boolean | User$sharedAiBotsArgs<ExtArgs>;
    aiUsageMetrics?: boolean | User$aiUsageMetricsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'User';
    objects: {
      ownedPaperlessInstances: Prisma.$PaperlessInstancePayload<ExtArgs>[];
      ownedAiProviders: Prisma.$AiProviderPayload<ExtArgs>[];
      ownedAiBots: Prisma.$AiBotPayload<ExtArgs>[];
      sharedPaperlessInstances: Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>[];
      sharedAiProviders: Prisma.$UserAiProviderAccessPayload<ExtArgs>[];
      sharedAiBots: Prisma.$UserAiBotAccessPayload<ExtArgs>[];
      aiUsageMetrics: Prisma.$AiUsageMetricPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        username: string;
        passwordHash: string;
        role: $Enums.UserRole;
        mustChangePassword: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User']; meta: { name: 'User' } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    ownedPaperlessInstances<T extends User$ownedPaperlessInstancesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$ownedPaperlessInstancesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PaperlessInstancePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    ownedAiProviders<T extends User$ownedAiProvidersArgs<ExtArgs> = {}>(
      args?: Subset<T, User$ownedAiProvidersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    ownedAiBots<T extends User$ownedAiBotsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$ownedAiBotsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    sharedPaperlessInstances<T extends User$sharedPaperlessInstancesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sharedPaperlessInstancesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    sharedAiProviders<T extends User$sharedAiProvidersArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sharedAiProvidersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$UserAiProviderAccessPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    sharedAiBots<T extends User$sharedAiBotsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sharedAiBotsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    aiUsageMetrics<T extends User$aiUsageMetricsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$aiUsageMetricsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly username: FieldRef<'User', 'String'>;
    readonly passwordHash: FieldRef<'User', 'String'>;
    readonly role: FieldRef<'User', 'UserRole'>;
    readonly mustChangePassword: FieldRef<'User', 'Boolean'>;
    readonly isActive: FieldRef<'User', 'Boolean'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly updatedAt: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.ownedPaperlessInstances
   */
  export type User$ownedPaperlessInstancesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    where?: PaperlessInstanceWhereInput;
    orderBy?:
      | PaperlessInstanceOrderByWithRelationInput
      | PaperlessInstanceOrderByWithRelationInput[];
    cursor?: PaperlessInstanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PaperlessInstanceScalarFieldEnum | PaperlessInstanceScalarFieldEnum[];
  };

  /**
   * User.ownedAiProviders
   */
  export type User$ownedAiProvidersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    where?: AiProviderWhereInput;
    orderBy?: AiProviderOrderByWithRelationInput | AiProviderOrderByWithRelationInput[];
    cursor?: AiProviderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AiProviderScalarFieldEnum | AiProviderScalarFieldEnum[];
  };

  /**
   * User.ownedAiBots
   */
  export type User$ownedAiBotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    where?: AiBotWhereInput;
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    cursor?: AiBotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AiBotScalarFieldEnum | AiBotScalarFieldEnum[];
  };

  /**
   * User.sharedPaperlessInstances
   */
  export type User$sharedPaperlessInstancesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    where?: UserPaperlessInstanceAccessWhereInput;
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | UserPaperlessInstanceAccessScalarFieldEnum
      | UserPaperlessInstanceAccessScalarFieldEnum[];
  };

  /**
   * User.sharedAiProviders
   */
  export type User$sharedAiProvidersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    where?: UserAiProviderAccessWhereInput;
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    cursor?: UserAiProviderAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserAiProviderAccessScalarFieldEnum | UserAiProviderAccessScalarFieldEnum[];
  };

  /**
   * User.sharedAiBots
   */
  export type User$sharedAiBotsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    where?: UserAiBotAccessWhereInput;
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    cursor?: UserAiBotAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserAiBotAccessScalarFieldEnum | UserAiBotAccessScalarFieldEnum[];
  };

  /**
   * User.aiUsageMetrics
   */
  export type User$aiUsageMetricsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    where?: AiUsageMetricWhereInput;
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    cursor?: AiUsageMetricWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
    };

  /**
   * Model UserPaperlessInstanceAccess
   */

  export type AggregateUserPaperlessInstanceAccess = {
    _count: UserPaperlessInstanceAccessCountAggregateOutputType | null;
    _min: UserPaperlessInstanceAccessMinAggregateOutputType | null;
    _max: UserPaperlessInstanceAccessMaxAggregateOutputType | null;
  };

  export type UserPaperlessInstanceAccessMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    instanceId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserPaperlessInstanceAccessMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    instanceId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserPaperlessInstanceAccessCountAggregateOutputType = {
    id: number;
    userId: number;
    instanceId: number;
    permission: number;
    createdAt: number;
    _all: number;
  };

  export type UserPaperlessInstanceAccessMinAggregateInputType = {
    id?: true;
    userId?: true;
    instanceId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserPaperlessInstanceAccessMaxAggregateInputType = {
    id?: true;
    userId?: true;
    instanceId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserPaperlessInstanceAccessCountAggregateInputType = {
    id?: true;
    userId?: true;
    instanceId?: true;
    permission?: true;
    createdAt?: true;
    _all?: true;
  };

  export type UserPaperlessInstanceAccessAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserPaperlessInstanceAccess to aggregate.
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPaperlessInstanceAccesses to fetch.
     */
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPaperlessInstanceAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPaperlessInstanceAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserPaperlessInstanceAccesses
     **/
    _count?: true | UserPaperlessInstanceAccessCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserPaperlessInstanceAccessMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserPaperlessInstanceAccessMaxAggregateInputType;
  };

  export type GetUserPaperlessInstanceAccessAggregateType<
    T extends UserPaperlessInstanceAccessAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateUserPaperlessInstanceAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPaperlessInstanceAccess[P]>
      : GetScalarType<T[P], AggregateUserPaperlessInstanceAccess[P]>;
  };

  export type UserPaperlessInstanceAccessGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserPaperlessInstanceAccessWhereInput;
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithAggregationInput
      | UserPaperlessInstanceAccessOrderByWithAggregationInput[];
    by: UserPaperlessInstanceAccessScalarFieldEnum[] | UserPaperlessInstanceAccessScalarFieldEnum;
    having?: UserPaperlessInstanceAccessScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserPaperlessInstanceAccessCountAggregateInputType | true;
    _min?: UserPaperlessInstanceAccessMinAggregateInputType;
    _max?: UserPaperlessInstanceAccessMaxAggregateInputType;
  };

  export type UserPaperlessInstanceAccessGroupByOutputType = {
    id: string;
    userId: string;
    instanceId: string;
    permission: $Enums.Permission;
    createdAt: Date;
    _count: UserPaperlessInstanceAccessCountAggregateOutputType | null;
    _min: UserPaperlessInstanceAccessMinAggregateOutputType | null;
    _max: UserPaperlessInstanceAccessMaxAggregateOutputType | null;
  };

  type GetUserPaperlessInstanceAccessGroupByPayload<
    T extends UserPaperlessInstanceAccessGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPaperlessInstanceAccessGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserPaperlessInstanceAccessGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserPaperlessInstanceAccessGroupByOutputType[P]>
          : GetScalarType<T[P], UserPaperlessInstanceAccessGroupByOutputType[P]>;
      }
    >
  >;

  export type UserPaperlessInstanceAccessSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      instanceId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userPaperlessInstanceAccess']
  >;

  export type UserPaperlessInstanceAccessSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      instanceId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userPaperlessInstanceAccess']
  >;

  export type UserPaperlessInstanceAccessSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      instanceId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userPaperlessInstanceAccess']
  >;

  export type UserPaperlessInstanceAccessSelectScalar = {
    id?: boolean;
    userId?: boolean;
    instanceId?: boolean;
    permission?: boolean;
    createdAt?: boolean;
  };

  export type UserPaperlessInstanceAccessOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'instanceId' | 'permission' | 'createdAt',
    ExtArgs['result']['userPaperlessInstanceAccess']
  >;
  export type UserPaperlessInstanceAccessInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type UserPaperlessInstanceAccessIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type UserPaperlessInstanceAccessIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    instance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };

  export type $UserPaperlessInstanceAccessPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'UserPaperlessInstanceAccess';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      instance: Prisma.$PaperlessInstancePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        instanceId: string;
        permission: $Enums.Permission;
        createdAt: Date;
      },
      ExtArgs['result']['userPaperlessInstanceAccess']
    >;
    composites: {};
  };

  type UserPaperlessInstanceAccessGetPayload<
    S extends boolean | null | undefined | UserPaperlessInstanceAccessDefaultArgs,
  > = $Result.GetResult<Prisma.$UserPaperlessInstanceAccessPayload, S>;

  type UserPaperlessInstanceAccessCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserPaperlessInstanceAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserPaperlessInstanceAccessCountAggregateInputType | true;
  };

  export interface UserPaperlessInstanceAccessDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['UserPaperlessInstanceAccess'];
      meta: { name: 'UserPaperlessInstanceAccess' };
    };
    /**
     * Find zero or one UserPaperlessInstanceAccess that matches the filter.
     * @param {UserPaperlessInstanceAccessFindUniqueArgs} args - Arguments to find a UserPaperlessInstanceAccess
     * @example
     * // Get one UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPaperlessInstanceAccessFindUniqueArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessFindUniqueArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one UserPaperlessInstanceAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPaperlessInstanceAccessFindUniqueOrThrowArgs} args - Arguments to find a UserPaperlessInstanceAccess
     * @example
     * // Get one UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPaperlessInstanceAccessFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserPaperlessInstanceAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessFindFirstArgs} args - Arguments to find a UserPaperlessInstanceAccess
     * @example
     * // Get one UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPaperlessInstanceAccessFindFirstArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessFindFirstArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserPaperlessInstanceAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessFindFirstOrThrowArgs} args - Arguments to find a UserPaperlessInstanceAccess
     * @example
     * // Get one UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPaperlessInstanceAccessFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more UserPaperlessInstanceAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccesses = await prisma.userPaperlessInstanceAccess.findMany()
     *
     * // Get first 10 UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccesses = await prisma.userPaperlessInstanceAccess.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userPaperlessInstanceAccessWithIdOnly = await prisma.userPaperlessInstanceAccess.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserPaperlessInstanceAccessFindManyArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a UserPaperlessInstanceAccess.
     * @param {UserPaperlessInstanceAccessCreateArgs} args - Arguments to create a UserPaperlessInstanceAccess.
     * @example
     * // Create one UserPaperlessInstanceAccess
     * const UserPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.create({
     *   data: {
     *     // ... data to create a UserPaperlessInstanceAccess
     *   }
     * })
     *
     */
    create<T extends UserPaperlessInstanceAccessCreateArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessCreateArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many UserPaperlessInstanceAccesses.
     * @param {UserPaperlessInstanceAccessCreateManyArgs} args - Arguments to create many UserPaperlessInstanceAccesses.
     * @example
     * // Create many UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserPaperlessInstanceAccessCreateManyArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many UserPaperlessInstanceAccesses and returns the data saved in the database.
     * @param {UserPaperlessInstanceAccessCreateManyAndReturnArgs} args - Arguments to create many UserPaperlessInstanceAccesses.
     * @example
     * // Create many UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserPaperlessInstanceAccesses and only return the `id`
     * const userPaperlessInstanceAccessWithIdOnly = await prisma.userPaperlessInstanceAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserPaperlessInstanceAccessCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a UserPaperlessInstanceAccess.
     * @param {UserPaperlessInstanceAccessDeleteArgs} args - Arguments to delete one UserPaperlessInstanceAccess.
     * @example
     * // Delete one UserPaperlessInstanceAccess
     * const UserPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.delete({
     *   where: {
     *     // ... filter to delete one UserPaperlessInstanceAccess
     *   }
     * })
     *
     */
    delete<T extends UserPaperlessInstanceAccessDeleteArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessDeleteArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one UserPaperlessInstanceAccess.
     * @param {UserPaperlessInstanceAccessUpdateArgs} args - Arguments to update one UserPaperlessInstanceAccess.
     * @example
     * // Update one UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserPaperlessInstanceAccessUpdateArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessUpdateArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more UserPaperlessInstanceAccesses.
     * @param {UserPaperlessInstanceAccessDeleteManyArgs} args - Arguments to filter UserPaperlessInstanceAccesses to delete.
     * @example
     * // Delete a few UserPaperlessInstanceAccesses
     * const { count } = await prisma.userPaperlessInstanceAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserPaperlessInstanceAccessDeleteManyArgs>(
      args?: SelectSubset<T, UserPaperlessInstanceAccessDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserPaperlessInstanceAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserPaperlessInstanceAccessUpdateManyArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserPaperlessInstanceAccesses and returns the data updated in the database.
     * @param {UserPaperlessInstanceAccessUpdateManyAndReturnArgs} args - Arguments to update many UserPaperlessInstanceAccesses.
     * @example
     * // Update many UserPaperlessInstanceAccesses
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserPaperlessInstanceAccesses and only return the `id`
     * const userPaperlessInstanceAccessWithIdOnly = await prisma.userPaperlessInstanceAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserPaperlessInstanceAccessUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one UserPaperlessInstanceAccess.
     * @param {UserPaperlessInstanceAccessUpsertArgs} args - Arguments to update or create a UserPaperlessInstanceAccess.
     * @example
     * // Update or create a UserPaperlessInstanceAccess
     * const userPaperlessInstanceAccess = await prisma.userPaperlessInstanceAccess.upsert({
     *   create: {
     *     // ... data to create a UserPaperlessInstanceAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPaperlessInstanceAccess we want to update
     *   }
     * })
     */
    upsert<T extends UserPaperlessInstanceAccessUpsertArgs>(
      args: SelectSubset<T, UserPaperlessInstanceAccessUpsertArgs<ExtArgs>>
    ): Prisma__UserPaperlessInstanceAccessClient<
      $Result.GetResult<
        Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of UserPaperlessInstanceAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessCountArgs} args - Arguments to filter UserPaperlessInstanceAccesses to count.
     * @example
     * // Count the number of UserPaperlessInstanceAccesses
     * const count = await prisma.userPaperlessInstanceAccess.count({
     *   where: {
     *     // ... the filter for the UserPaperlessInstanceAccesses we want to count
     *   }
     * })
     **/
    count<T extends UserPaperlessInstanceAccessCountArgs>(
      args?: Subset<T, UserPaperlessInstanceAccessCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPaperlessInstanceAccessCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a UserPaperlessInstanceAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserPaperlessInstanceAccessAggregateArgs>(
      args: Subset<T, UserPaperlessInstanceAccessAggregateArgs>
    ): Prisma.PrismaPromise<GetUserPaperlessInstanceAccessAggregateType<T>>;

    /**
     * Group by UserPaperlessInstanceAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPaperlessInstanceAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserPaperlessInstanceAccessGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPaperlessInstanceAccessGroupByArgs['orderBy'] }
        : { orderBy?: UserPaperlessInstanceAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserPaperlessInstanceAccessGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserPaperlessInstanceAccessGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserPaperlessInstanceAccess model
     */
    readonly fields: UserPaperlessInstanceAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPaperlessInstanceAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPaperlessInstanceAccessClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    instance<T extends PaperlessInstanceDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstanceDefaultArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      | $Result.GetResult<
          Prisma.$PaperlessInstancePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the UserPaperlessInstanceAccess model
   */
  interface UserPaperlessInstanceAccessFieldRefs {
    readonly id: FieldRef<'UserPaperlessInstanceAccess', 'String'>;
    readonly userId: FieldRef<'UserPaperlessInstanceAccess', 'String'>;
    readonly instanceId: FieldRef<'UserPaperlessInstanceAccess', 'String'>;
    readonly permission: FieldRef<'UserPaperlessInstanceAccess', 'Permission'>;
    readonly createdAt: FieldRef<'UserPaperlessInstanceAccess', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * UserPaperlessInstanceAccess findUnique
   */
  export type UserPaperlessInstanceAccessFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserPaperlessInstanceAccess to fetch.
     */
    where: UserPaperlessInstanceAccessWhereUniqueInput;
  };

  /**
   * UserPaperlessInstanceAccess findUniqueOrThrow
   */
  export type UserPaperlessInstanceAccessFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserPaperlessInstanceAccess to fetch.
     */
    where: UserPaperlessInstanceAccessWhereUniqueInput;
  };

  /**
   * UserPaperlessInstanceAccess findFirst
   */
  export type UserPaperlessInstanceAccessFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserPaperlessInstanceAccess to fetch.
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPaperlessInstanceAccesses to fetch.
     */
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserPaperlessInstanceAccesses.
     */
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPaperlessInstanceAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPaperlessInstanceAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserPaperlessInstanceAccesses.
     */
    distinct?:
      | UserPaperlessInstanceAccessScalarFieldEnum
      | UserPaperlessInstanceAccessScalarFieldEnum[];
  };

  /**
   * UserPaperlessInstanceAccess findFirstOrThrow
   */
  export type UserPaperlessInstanceAccessFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserPaperlessInstanceAccess to fetch.
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPaperlessInstanceAccesses to fetch.
     */
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserPaperlessInstanceAccesses.
     */
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPaperlessInstanceAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPaperlessInstanceAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserPaperlessInstanceAccesses.
     */
    distinct?:
      | UserPaperlessInstanceAccessScalarFieldEnum
      | UserPaperlessInstanceAccessScalarFieldEnum[];
  };

  /**
   * UserPaperlessInstanceAccess findMany
   */
  export type UserPaperlessInstanceAccessFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserPaperlessInstanceAccesses to fetch.
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPaperlessInstanceAccesses to fetch.
     */
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserPaperlessInstanceAccesses.
     */
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPaperlessInstanceAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPaperlessInstanceAccesses.
     */
    skip?: number;
    distinct?:
      | UserPaperlessInstanceAccessScalarFieldEnum
      | UserPaperlessInstanceAccessScalarFieldEnum[];
  };

  /**
   * UserPaperlessInstanceAccess create
   */
  export type UserPaperlessInstanceAccessCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserPaperlessInstanceAccess.
     */
    data: XOR<
      UserPaperlessInstanceAccessCreateInput,
      UserPaperlessInstanceAccessUncheckedCreateInput
    >;
  };

  /**
   * UserPaperlessInstanceAccess createMany
   */
  export type UserPaperlessInstanceAccessCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many UserPaperlessInstanceAccesses.
     */
    data: UserPaperlessInstanceAccessCreateManyInput | UserPaperlessInstanceAccessCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * UserPaperlessInstanceAccess createManyAndReturn
   */
  export type UserPaperlessInstanceAccessCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * The data used to create many UserPaperlessInstanceAccesses.
     */
    data: UserPaperlessInstanceAccessCreateManyInput | UserPaperlessInstanceAccessCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserPaperlessInstanceAccess update
   */
  export type UserPaperlessInstanceAccessUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserPaperlessInstanceAccess.
     */
    data: XOR<
      UserPaperlessInstanceAccessUpdateInput,
      UserPaperlessInstanceAccessUncheckedUpdateInput
    >;
    /**
     * Choose, which UserPaperlessInstanceAccess to update.
     */
    where: UserPaperlessInstanceAccessWhereUniqueInput;
  };

  /**
   * UserPaperlessInstanceAccess updateMany
   */
  export type UserPaperlessInstanceAccessUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update UserPaperlessInstanceAccesses.
     */
    data: XOR<
      UserPaperlessInstanceAccessUpdateManyMutationInput,
      UserPaperlessInstanceAccessUncheckedUpdateManyInput
    >;
    /**
     * Filter which UserPaperlessInstanceAccesses to update
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * Limit how many UserPaperlessInstanceAccesses to update.
     */
    limit?: number;
  };

  /**
   * UserPaperlessInstanceAccess updateManyAndReturn
   */
  export type UserPaperlessInstanceAccessUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * The data used to update UserPaperlessInstanceAccesses.
     */
    data: XOR<
      UserPaperlessInstanceAccessUpdateManyMutationInput,
      UserPaperlessInstanceAccessUncheckedUpdateManyInput
    >;
    /**
     * Filter which UserPaperlessInstanceAccesses to update
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * Limit how many UserPaperlessInstanceAccesses to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserPaperlessInstanceAccess upsert
   */
  export type UserPaperlessInstanceAccessUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserPaperlessInstanceAccess to update in case it exists.
     */
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    /**
     * In case the UserPaperlessInstanceAccess found by the `where` argument doesn't exist, create a new UserPaperlessInstanceAccess with this data.
     */
    create: XOR<
      UserPaperlessInstanceAccessCreateInput,
      UserPaperlessInstanceAccessUncheckedCreateInput
    >;
    /**
     * In case the UserPaperlessInstanceAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      UserPaperlessInstanceAccessUpdateInput,
      UserPaperlessInstanceAccessUncheckedUpdateInput
    >;
  };

  /**
   * UserPaperlessInstanceAccess delete
   */
  export type UserPaperlessInstanceAccessDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    /**
     * Filter which UserPaperlessInstanceAccess to delete.
     */
    where: UserPaperlessInstanceAccessWhereUniqueInput;
  };

  /**
   * UserPaperlessInstanceAccess deleteMany
   */
  export type UserPaperlessInstanceAccessDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserPaperlessInstanceAccesses to delete
     */
    where?: UserPaperlessInstanceAccessWhereInput;
    /**
     * Limit how many UserPaperlessInstanceAccesses to delete.
     */
    limit?: number;
  };

  /**
   * UserPaperlessInstanceAccess without action
   */
  export type UserPaperlessInstanceAccessDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
  };

  /**
   * Model UserAiProviderAccess
   */

  export type AggregateUserAiProviderAccess = {
    _count: UserAiProviderAccessCountAggregateOutputType | null;
    _min: UserAiProviderAccessMinAggregateOutputType | null;
    _max: UserAiProviderAccessMaxAggregateOutputType | null;
  };

  export type UserAiProviderAccessMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    aiProviderId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserAiProviderAccessMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    aiProviderId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserAiProviderAccessCountAggregateOutputType = {
    id: number;
    userId: number;
    aiProviderId: number;
    permission: number;
    createdAt: number;
    _all: number;
  };

  export type UserAiProviderAccessMinAggregateInputType = {
    id?: true;
    userId?: true;
    aiProviderId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserAiProviderAccessMaxAggregateInputType = {
    id?: true;
    userId?: true;
    aiProviderId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserAiProviderAccessCountAggregateInputType = {
    id?: true;
    userId?: true;
    aiProviderId?: true;
    permission?: true;
    createdAt?: true;
    _all?: true;
  };

  export type UserAiProviderAccessAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserAiProviderAccess to aggregate.
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiProviderAccesses to fetch.
     */
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserAiProviderAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiProviderAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiProviderAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserAiProviderAccesses
     **/
    _count?: true | UserAiProviderAccessCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserAiProviderAccessMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserAiProviderAccessMaxAggregateInputType;
  };

  export type GetUserAiProviderAccessAggregateType<T extends UserAiProviderAccessAggregateArgs> = {
    [P in keyof T & keyof AggregateUserAiProviderAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAiProviderAccess[P]>
      : GetScalarType<T[P], AggregateUserAiProviderAccess[P]>;
  };

  export type UserAiProviderAccessGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiProviderAccessWhereInput;
    orderBy?:
      | UserAiProviderAccessOrderByWithAggregationInput
      | UserAiProviderAccessOrderByWithAggregationInput[];
    by: UserAiProviderAccessScalarFieldEnum[] | UserAiProviderAccessScalarFieldEnum;
    having?: UserAiProviderAccessScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserAiProviderAccessCountAggregateInputType | true;
    _min?: UserAiProviderAccessMinAggregateInputType;
    _max?: UserAiProviderAccessMaxAggregateInputType;
  };

  export type UserAiProviderAccessGroupByOutputType = {
    id: string;
    userId: string;
    aiProviderId: string;
    permission: $Enums.Permission;
    createdAt: Date;
    _count: UserAiProviderAccessCountAggregateOutputType | null;
    _min: UserAiProviderAccessMinAggregateOutputType | null;
    _max: UserAiProviderAccessMaxAggregateOutputType | null;
  };

  type GetUserAiProviderAccessGroupByPayload<T extends UserAiProviderAccessGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UserAiProviderAccessGroupByOutputType, T['by']> & {
          [P in keyof T & keyof UserAiProviderAccessGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAiProviderAccessGroupByOutputType[P]>
            : GetScalarType<T[P], UserAiProviderAccessGroupByOutputType[P]>;
        }
      >
    >;

  export type UserAiProviderAccessSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiProviderId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiProviderAccess']
  >;

  export type UserAiProviderAccessSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiProviderId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiProviderAccess']
  >;

  export type UserAiProviderAccessSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiProviderId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiProviderAccess']
  >;

  export type UserAiProviderAccessSelectScalar = {
    id?: boolean;
    userId?: boolean;
    aiProviderId?: boolean;
    permission?: boolean;
    createdAt?: boolean;
  };

  export type UserAiProviderAccessOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'aiProviderId' | 'permission' | 'createdAt',
    ExtArgs['result']['userAiProviderAccess']
  >;
  export type UserAiProviderAccessInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
  };
  export type UserAiProviderAccessIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
  };
  export type UserAiProviderAccessIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
  };

  export type $UserAiProviderAccessPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'UserAiProviderAccess';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      aiProvider: Prisma.$AiProviderPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        aiProviderId: string;
        permission: $Enums.Permission;
        createdAt: Date;
      },
      ExtArgs['result']['userAiProviderAccess']
    >;
    composites: {};
  };

  type UserAiProviderAccessGetPayload<
    S extends boolean | null | undefined | UserAiProviderAccessDefaultArgs,
  > = $Result.GetResult<Prisma.$UserAiProviderAccessPayload, S>;

  type UserAiProviderAccessCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserAiProviderAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserAiProviderAccessCountAggregateInputType | true;
  };

  export interface UserAiProviderAccessDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['UserAiProviderAccess'];
      meta: { name: 'UserAiProviderAccess' };
    };
    /**
     * Find zero or one UserAiProviderAccess that matches the filter.
     * @param {UserAiProviderAccessFindUniqueArgs} args - Arguments to find a UserAiProviderAccess
     * @example
     * // Get one UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAiProviderAccessFindUniqueArgs>(
      args: SelectSubset<T, UserAiProviderAccessFindUniqueArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one UserAiProviderAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAiProviderAccessFindUniqueOrThrowArgs} args - Arguments to find a UserAiProviderAccess
     * @example
     * // Get one UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAiProviderAccessFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserAiProviderAccessFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserAiProviderAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessFindFirstArgs} args - Arguments to find a UserAiProviderAccess
     * @example
     * // Get one UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAiProviderAccessFindFirstArgs>(
      args?: SelectSubset<T, UserAiProviderAccessFindFirstArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserAiProviderAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessFindFirstOrThrowArgs} args - Arguments to find a UserAiProviderAccess
     * @example
     * // Get one UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAiProviderAccessFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserAiProviderAccessFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more UserAiProviderAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAiProviderAccesses
     * const userAiProviderAccesses = await prisma.userAiProviderAccess.findMany()
     *
     * // Get first 10 UserAiProviderAccesses
     * const userAiProviderAccesses = await prisma.userAiProviderAccess.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userAiProviderAccessWithIdOnly = await prisma.userAiProviderAccess.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserAiProviderAccessFindManyArgs>(
      args?: SelectSubset<T, UserAiProviderAccessFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a UserAiProviderAccess.
     * @param {UserAiProviderAccessCreateArgs} args - Arguments to create a UserAiProviderAccess.
     * @example
     * // Create one UserAiProviderAccess
     * const UserAiProviderAccess = await prisma.userAiProviderAccess.create({
     *   data: {
     *     // ... data to create a UserAiProviderAccess
     *   }
     * })
     *
     */
    create<T extends UserAiProviderAccessCreateArgs>(
      args: SelectSubset<T, UserAiProviderAccessCreateArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many UserAiProviderAccesses.
     * @param {UserAiProviderAccessCreateManyArgs} args - Arguments to create many UserAiProviderAccesses.
     * @example
     * // Create many UserAiProviderAccesses
     * const userAiProviderAccess = await prisma.userAiProviderAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserAiProviderAccessCreateManyArgs>(
      args?: SelectSubset<T, UserAiProviderAccessCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many UserAiProviderAccesses and returns the data saved in the database.
     * @param {UserAiProviderAccessCreateManyAndReturnArgs} args - Arguments to create many UserAiProviderAccesses.
     * @example
     * // Create many UserAiProviderAccesses
     * const userAiProviderAccess = await prisma.userAiProviderAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserAiProviderAccesses and only return the `id`
     * const userAiProviderAccessWithIdOnly = await prisma.userAiProviderAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserAiProviderAccessCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserAiProviderAccessCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a UserAiProviderAccess.
     * @param {UserAiProviderAccessDeleteArgs} args - Arguments to delete one UserAiProviderAccess.
     * @example
     * // Delete one UserAiProviderAccess
     * const UserAiProviderAccess = await prisma.userAiProviderAccess.delete({
     *   where: {
     *     // ... filter to delete one UserAiProviderAccess
     *   }
     * })
     *
     */
    delete<T extends UserAiProviderAccessDeleteArgs>(
      args: SelectSubset<T, UserAiProviderAccessDeleteArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one UserAiProviderAccess.
     * @param {UserAiProviderAccessUpdateArgs} args - Arguments to update one UserAiProviderAccess.
     * @example
     * // Update one UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserAiProviderAccessUpdateArgs>(
      args: SelectSubset<T, UserAiProviderAccessUpdateArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more UserAiProviderAccesses.
     * @param {UserAiProviderAccessDeleteManyArgs} args - Arguments to filter UserAiProviderAccesses to delete.
     * @example
     * // Delete a few UserAiProviderAccesses
     * const { count } = await prisma.userAiProviderAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserAiProviderAccessDeleteManyArgs>(
      args?: SelectSubset<T, UserAiProviderAccessDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserAiProviderAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAiProviderAccesses
     * const userAiProviderAccess = await prisma.userAiProviderAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserAiProviderAccessUpdateManyArgs>(
      args: SelectSubset<T, UserAiProviderAccessUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserAiProviderAccesses and returns the data updated in the database.
     * @param {UserAiProviderAccessUpdateManyAndReturnArgs} args - Arguments to update many UserAiProviderAccesses.
     * @example
     * // Update many UserAiProviderAccesses
     * const userAiProviderAccess = await prisma.userAiProviderAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserAiProviderAccesses and only return the `id`
     * const userAiProviderAccessWithIdOnly = await prisma.userAiProviderAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserAiProviderAccessUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserAiProviderAccessUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one UserAiProviderAccess.
     * @param {UserAiProviderAccessUpsertArgs} args - Arguments to update or create a UserAiProviderAccess.
     * @example
     * // Update or create a UserAiProviderAccess
     * const userAiProviderAccess = await prisma.userAiProviderAccess.upsert({
     *   create: {
     *     // ... data to create a UserAiProviderAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAiProviderAccess we want to update
     *   }
     * })
     */
    upsert<T extends UserAiProviderAccessUpsertArgs>(
      args: SelectSubset<T, UserAiProviderAccessUpsertArgs<ExtArgs>>
    ): Prisma__UserAiProviderAccessClient<
      $Result.GetResult<
        Prisma.$UserAiProviderAccessPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of UserAiProviderAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessCountArgs} args - Arguments to filter UserAiProviderAccesses to count.
     * @example
     * // Count the number of UserAiProviderAccesses
     * const count = await prisma.userAiProviderAccess.count({
     *   where: {
     *     // ... the filter for the UserAiProviderAccesses we want to count
     *   }
     * })
     **/
    count<T extends UserAiProviderAccessCountArgs>(
      args?: Subset<T, UserAiProviderAccessCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAiProviderAccessCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a UserAiProviderAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAiProviderAccessAggregateArgs>(
      args: Subset<T, UserAiProviderAccessAggregateArgs>
    ): Prisma.PrismaPromise<GetUserAiProviderAccessAggregateType<T>>;

    /**
     * Group by UserAiProviderAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiProviderAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserAiProviderAccessGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAiProviderAccessGroupByArgs['orderBy'] }
        : { orderBy?: UserAiProviderAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserAiProviderAccessGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserAiProviderAccessGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserAiProviderAccess model
     */
    readonly fields: UserAiProviderAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAiProviderAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAiProviderAccessClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    aiProvider<T extends AiProviderDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AiProviderDefaultArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      | $Result.GetResult<
          Prisma.$AiProviderPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the UserAiProviderAccess model
   */
  interface UserAiProviderAccessFieldRefs {
    readonly id: FieldRef<'UserAiProviderAccess', 'String'>;
    readonly userId: FieldRef<'UserAiProviderAccess', 'String'>;
    readonly aiProviderId: FieldRef<'UserAiProviderAccess', 'String'>;
    readonly permission: FieldRef<'UserAiProviderAccess', 'Permission'>;
    readonly createdAt: FieldRef<'UserAiProviderAccess', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * UserAiProviderAccess findUnique
   */
  export type UserAiProviderAccessFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiProviderAccess to fetch.
     */
    where: UserAiProviderAccessWhereUniqueInput;
  };

  /**
   * UserAiProviderAccess findUniqueOrThrow
   */
  export type UserAiProviderAccessFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiProviderAccess to fetch.
     */
    where: UserAiProviderAccessWhereUniqueInput;
  };

  /**
   * UserAiProviderAccess findFirst
   */
  export type UserAiProviderAccessFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiProviderAccess to fetch.
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiProviderAccesses to fetch.
     */
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserAiProviderAccesses.
     */
    cursor?: UserAiProviderAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiProviderAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiProviderAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserAiProviderAccesses.
     */
    distinct?: UserAiProviderAccessScalarFieldEnum | UserAiProviderAccessScalarFieldEnum[];
  };

  /**
   * UserAiProviderAccess findFirstOrThrow
   */
  export type UserAiProviderAccessFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiProviderAccess to fetch.
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiProviderAccesses to fetch.
     */
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserAiProviderAccesses.
     */
    cursor?: UserAiProviderAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiProviderAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiProviderAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserAiProviderAccesses.
     */
    distinct?: UserAiProviderAccessScalarFieldEnum | UserAiProviderAccessScalarFieldEnum[];
  };

  /**
   * UserAiProviderAccess findMany
   */
  export type UserAiProviderAccessFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiProviderAccesses to fetch.
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiProviderAccesses to fetch.
     */
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserAiProviderAccesses.
     */
    cursor?: UserAiProviderAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiProviderAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiProviderAccesses.
     */
    skip?: number;
    distinct?: UserAiProviderAccessScalarFieldEnum | UserAiProviderAccessScalarFieldEnum[];
  };

  /**
   * UserAiProviderAccess create
   */
  export type UserAiProviderAccessCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserAiProviderAccess.
     */
    data: XOR<UserAiProviderAccessCreateInput, UserAiProviderAccessUncheckedCreateInput>;
  };

  /**
   * UserAiProviderAccess createMany
   */
  export type UserAiProviderAccessCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many UserAiProviderAccesses.
     */
    data: UserAiProviderAccessCreateManyInput | UserAiProviderAccessCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * UserAiProviderAccess createManyAndReturn
   */
  export type UserAiProviderAccessCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * The data used to create many UserAiProviderAccesses.
     */
    data: UserAiProviderAccessCreateManyInput | UserAiProviderAccessCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserAiProviderAccess update
   */
  export type UserAiProviderAccessUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserAiProviderAccess.
     */
    data: XOR<UserAiProviderAccessUpdateInput, UserAiProviderAccessUncheckedUpdateInput>;
    /**
     * Choose, which UserAiProviderAccess to update.
     */
    where: UserAiProviderAccessWhereUniqueInput;
  };

  /**
   * UserAiProviderAccess updateMany
   */
  export type UserAiProviderAccessUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update UserAiProviderAccesses.
     */
    data: XOR<
      UserAiProviderAccessUpdateManyMutationInput,
      UserAiProviderAccessUncheckedUpdateManyInput
    >;
    /**
     * Filter which UserAiProviderAccesses to update
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * Limit how many UserAiProviderAccesses to update.
     */
    limit?: number;
  };

  /**
   * UserAiProviderAccess updateManyAndReturn
   */
  export type UserAiProviderAccessUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * The data used to update UserAiProviderAccesses.
     */
    data: XOR<
      UserAiProviderAccessUpdateManyMutationInput,
      UserAiProviderAccessUncheckedUpdateManyInput
    >;
    /**
     * Filter which UserAiProviderAccesses to update
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * Limit how many UserAiProviderAccesses to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserAiProviderAccess upsert
   */
  export type UserAiProviderAccessUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserAiProviderAccess to update in case it exists.
     */
    where: UserAiProviderAccessWhereUniqueInput;
    /**
     * In case the UserAiProviderAccess found by the `where` argument doesn't exist, create a new UserAiProviderAccess with this data.
     */
    create: XOR<UserAiProviderAccessCreateInput, UserAiProviderAccessUncheckedCreateInput>;
    /**
     * In case the UserAiProviderAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAiProviderAccessUpdateInput, UserAiProviderAccessUncheckedUpdateInput>;
  };

  /**
   * UserAiProviderAccess delete
   */
  export type UserAiProviderAccessDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    /**
     * Filter which UserAiProviderAccess to delete.
     */
    where: UserAiProviderAccessWhereUniqueInput;
  };

  /**
   * UserAiProviderAccess deleteMany
   */
  export type UserAiProviderAccessDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserAiProviderAccesses to delete
     */
    where?: UserAiProviderAccessWhereInput;
    /**
     * Limit how many UserAiProviderAccesses to delete.
     */
    limit?: number;
  };

  /**
   * UserAiProviderAccess without action
   */
  export type UserAiProviderAccessDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
  };

  /**
   * Model UserAiBotAccess
   */

  export type AggregateUserAiBotAccess = {
    _count: UserAiBotAccessCountAggregateOutputType | null;
    _min: UserAiBotAccessMinAggregateOutputType | null;
    _max: UserAiBotAccessMaxAggregateOutputType | null;
  };

  export type UserAiBotAccessMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    aiBotId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserAiBotAccessMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    aiBotId: string | null;
    permission: $Enums.Permission | null;
    createdAt: Date | null;
  };

  export type UserAiBotAccessCountAggregateOutputType = {
    id: number;
    userId: number;
    aiBotId: number;
    permission: number;
    createdAt: number;
    _all: number;
  };

  export type UserAiBotAccessMinAggregateInputType = {
    id?: true;
    userId?: true;
    aiBotId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserAiBotAccessMaxAggregateInputType = {
    id?: true;
    userId?: true;
    aiBotId?: true;
    permission?: true;
    createdAt?: true;
  };

  export type UserAiBotAccessCountAggregateInputType = {
    id?: true;
    userId?: true;
    aiBotId?: true;
    permission?: true;
    createdAt?: true;
    _all?: true;
  };

  export type UserAiBotAccessAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserAiBotAccess to aggregate.
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiBotAccesses to fetch.
     */
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserAiBotAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiBotAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiBotAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserAiBotAccesses
     **/
    _count?: true | UserAiBotAccessCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserAiBotAccessMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserAiBotAccessMaxAggregateInputType;
  };

  export type GetUserAiBotAccessAggregateType<T extends UserAiBotAccessAggregateArgs> = {
    [P in keyof T & keyof AggregateUserAiBotAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAiBotAccess[P]>
      : GetScalarType<T[P], AggregateUserAiBotAccess[P]>;
  };

  export type UserAiBotAccessGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserAiBotAccessWhereInput;
    orderBy?:
      | UserAiBotAccessOrderByWithAggregationInput
      | UserAiBotAccessOrderByWithAggregationInput[];
    by: UserAiBotAccessScalarFieldEnum[] | UserAiBotAccessScalarFieldEnum;
    having?: UserAiBotAccessScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserAiBotAccessCountAggregateInputType | true;
    _min?: UserAiBotAccessMinAggregateInputType;
    _max?: UserAiBotAccessMaxAggregateInputType;
  };

  export type UserAiBotAccessGroupByOutputType = {
    id: string;
    userId: string;
    aiBotId: string;
    permission: $Enums.Permission;
    createdAt: Date;
    _count: UserAiBotAccessCountAggregateOutputType | null;
    _min: UserAiBotAccessMinAggregateOutputType | null;
    _max: UserAiBotAccessMaxAggregateOutputType | null;
  };

  type GetUserAiBotAccessGroupByPayload<T extends UserAiBotAccessGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UserAiBotAccessGroupByOutputType, T['by']> & {
          [P in keyof T & keyof UserAiBotAccessGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAiBotAccessGroupByOutputType[P]>
            : GetScalarType<T[P], UserAiBotAccessGroupByOutputType[P]>;
        }
      >
    >;

  export type UserAiBotAccessSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiBotAccess']
  >;

  export type UserAiBotAccessSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiBotAccess']
  >;

  export type UserAiBotAccessSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      permission?: boolean;
      createdAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['userAiBotAccess']
  >;

  export type UserAiBotAccessSelectScalar = {
    id?: boolean;
    userId?: boolean;
    aiBotId?: boolean;
    permission?: boolean;
    createdAt?: boolean;
  };

  export type UserAiBotAccessOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'userId' | 'aiBotId' | 'permission' | 'createdAt',
    ExtArgs['result']['userAiBotAccess']
  >;
  export type UserAiBotAccessInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
  };
  export type UserAiBotAccessIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
  };
  export type UserAiBotAccessIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiBotDefaultArgs<ExtArgs>;
  };

  export type $UserAiBotAccessPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'UserAiBotAccess';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      aiBot: Prisma.$AiBotPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        aiBotId: string;
        permission: $Enums.Permission;
        createdAt: Date;
      },
      ExtArgs['result']['userAiBotAccess']
    >;
    composites: {};
  };

  type UserAiBotAccessGetPayload<
    S extends boolean | null | undefined | UserAiBotAccessDefaultArgs,
  > = $Result.GetResult<Prisma.$UserAiBotAccessPayload, S>;

  type UserAiBotAccessCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserAiBotAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserAiBotAccessCountAggregateInputType | true;
  };

  export interface UserAiBotAccessDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['UserAiBotAccess'];
      meta: { name: 'UserAiBotAccess' };
    };
    /**
     * Find zero or one UserAiBotAccess that matches the filter.
     * @param {UserAiBotAccessFindUniqueArgs} args - Arguments to find a UserAiBotAccess
     * @example
     * // Get one UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAiBotAccessFindUniqueArgs>(
      args: SelectSubset<T, UserAiBotAccessFindUniqueArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one UserAiBotAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAiBotAccessFindUniqueOrThrowArgs} args - Arguments to find a UserAiBotAccess
     * @example
     * // Get one UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAiBotAccessFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserAiBotAccessFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserAiBotAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessFindFirstArgs} args - Arguments to find a UserAiBotAccess
     * @example
     * // Get one UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAiBotAccessFindFirstArgs>(
      args?: SelectSubset<T, UserAiBotAccessFindFirstArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first UserAiBotAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessFindFirstOrThrowArgs} args - Arguments to find a UserAiBotAccess
     * @example
     * // Get one UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAiBotAccessFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserAiBotAccessFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more UserAiBotAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAiBotAccesses
     * const userAiBotAccesses = await prisma.userAiBotAccess.findMany()
     *
     * // Get first 10 UserAiBotAccesses
     * const userAiBotAccesses = await prisma.userAiBotAccess.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userAiBotAccessWithIdOnly = await prisma.userAiBotAccess.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserAiBotAccessFindManyArgs>(
      args?: SelectSubset<T, UserAiBotAccessFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a UserAiBotAccess.
     * @param {UserAiBotAccessCreateArgs} args - Arguments to create a UserAiBotAccess.
     * @example
     * // Create one UserAiBotAccess
     * const UserAiBotAccess = await prisma.userAiBotAccess.create({
     *   data: {
     *     // ... data to create a UserAiBotAccess
     *   }
     * })
     *
     */
    create<T extends UserAiBotAccessCreateArgs>(
      args: SelectSubset<T, UserAiBotAccessCreateArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many UserAiBotAccesses.
     * @param {UserAiBotAccessCreateManyArgs} args - Arguments to create many UserAiBotAccesses.
     * @example
     * // Create many UserAiBotAccesses
     * const userAiBotAccess = await prisma.userAiBotAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserAiBotAccessCreateManyArgs>(
      args?: SelectSubset<T, UserAiBotAccessCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many UserAiBotAccesses and returns the data saved in the database.
     * @param {UserAiBotAccessCreateManyAndReturnArgs} args - Arguments to create many UserAiBotAccesses.
     * @example
     * // Create many UserAiBotAccesses
     * const userAiBotAccess = await prisma.userAiBotAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserAiBotAccesses and only return the `id`
     * const userAiBotAccessWithIdOnly = await prisma.userAiBotAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserAiBotAccessCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserAiBotAccessCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a UserAiBotAccess.
     * @param {UserAiBotAccessDeleteArgs} args - Arguments to delete one UserAiBotAccess.
     * @example
     * // Delete one UserAiBotAccess
     * const UserAiBotAccess = await prisma.userAiBotAccess.delete({
     *   where: {
     *     // ... filter to delete one UserAiBotAccess
     *   }
     * })
     *
     */
    delete<T extends UserAiBotAccessDeleteArgs>(
      args: SelectSubset<T, UserAiBotAccessDeleteArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one UserAiBotAccess.
     * @param {UserAiBotAccessUpdateArgs} args - Arguments to update one UserAiBotAccess.
     * @example
     * // Update one UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserAiBotAccessUpdateArgs>(
      args: SelectSubset<T, UserAiBotAccessUpdateArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more UserAiBotAccesses.
     * @param {UserAiBotAccessDeleteManyArgs} args - Arguments to filter UserAiBotAccesses to delete.
     * @example
     * // Delete a few UserAiBotAccesses
     * const { count } = await prisma.userAiBotAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserAiBotAccessDeleteManyArgs>(
      args?: SelectSubset<T, UserAiBotAccessDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserAiBotAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAiBotAccesses
     * const userAiBotAccess = await prisma.userAiBotAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserAiBotAccessUpdateManyArgs>(
      args: SelectSubset<T, UserAiBotAccessUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more UserAiBotAccesses and returns the data updated in the database.
     * @param {UserAiBotAccessUpdateManyAndReturnArgs} args - Arguments to update many UserAiBotAccesses.
     * @example
     * // Update many UserAiBotAccesses
     * const userAiBotAccess = await prisma.userAiBotAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserAiBotAccesses and only return the `id`
     * const userAiBotAccessWithIdOnly = await prisma.userAiBotAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserAiBotAccessUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserAiBotAccessUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserAiBotAccessPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one UserAiBotAccess.
     * @param {UserAiBotAccessUpsertArgs} args - Arguments to update or create a UserAiBotAccess.
     * @example
     * // Update or create a UserAiBotAccess
     * const userAiBotAccess = await prisma.userAiBotAccess.upsert({
     *   create: {
     *     // ... data to create a UserAiBotAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAiBotAccess we want to update
     *   }
     * })
     */
    upsert<T extends UserAiBotAccessUpsertArgs>(
      args: SelectSubset<T, UserAiBotAccessUpsertArgs<ExtArgs>>
    ): Prisma__UserAiBotAccessClient<
      $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of UserAiBotAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessCountArgs} args - Arguments to filter UserAiBotAccesses to count.
     * @example
     * // Count the number of UserAiBotAccesses
     * const count = await prisma.userAiBotAccess.count({
     *   where: {
     *     // ... the filter for the UserAiBotAccesses we want to count
     *   }
     * })
     **/
    count<T extends UserAiBotAccessCountArgs>(
      args?: Subset<T, UserAiBotAccessCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAiBotAccessCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a UserAiBotAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAiBotAccessAggregateArgs>(
      args: Subset<T, UserAiBotAccessAggregateArgs>
    ): Prisma.PrismaPromise<GetUserAiBotAccessAggregateType<T>>;

    /**
     * Group by UserAiBotAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAiBotAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserAiBotAccessGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAiBotAccessGroupByArgs['orderBy'] }
        : { orderBy?: UserAiBotAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserAiBotAccessGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserAiBotAccessGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserAiBotAccess model
     */
    readonly fields: UserAiBotAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAiBotAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAiBotAccessClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    aiBot<T extends AiBotDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AiBotDefaultArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      | $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the UserAiBotAccess model
   */
  interface UserAiBotAccessFieldRefs {
    readonly id: FieldRef<'UserAiBotAccess', 'String'>;
    readonly userId: FieldRef<'UserAiBotAccess', 'String'>;
    readonly aiBotId: FieldRef<'UserAiBotAccess', 'String'>;
    readonly permission: FieldRef<'UserAiBotAccess', 'Permission'>;
    readonly createdAt: FieldRef<'UserAiBotAccess', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * UserAiBotAccess findUnique
   */
  export type UserAiBotAccessFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiBotAccess to fetch.
     */
    where: UserAiBotAccessWhereUniqueInput;
  };

  /**
   * UserAiBotAccess findUniqueOrThrow
   */
  export type UserAiBotAccessFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiBotAccess to fetch.
     */
    where: UserAiBotAccessWhereUniqueInput;
  };

  /**
   * UserAiBotAccess findFirst
   */
  export type UserAiBotAccessFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiBotAccess to fetch.
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiBotAccesses to fetch.
     */
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserAiBotAccesses.
     */
    cursor?: UserAiBotAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiBotAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiBotAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserAiBotAccesses.
     */
    distinct?: UserAiBotAccessScalarFieldEnum | UserAiBotAccessScalarFieldEnum[];
  };

  /**
   * UserAiBotAccess findFirstOrThrow
   */
  export type UserAiBotAccessFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiBotAccess to fetch.
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiBotAccesses to fetch.
     */
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserAiBotAccesses.
     */
    cursor?: UserAiBotAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiBotAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiBotAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserAiBotAccesses.
     */
    distinct?: UserAiBotAccessScalarFieldEnum | UserAiBotAccessScalarFieldEnum[];
  };

  /**
   * UserAiBotAccess findMany
   */
  export type UserAiBotAccessFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter, which UserAiBotAccesses to fetch.
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserAiBotAccesses to fetch.
     */
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserAiBotAccesses.
     */
    cursor?: UserAiBotAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserAiBotAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserAiBotAccesses.
     */
    skip?: number;
    distinct?: UserAiBotAccessScalarFieldEnum | UserAiBotAccessScalarFieldEnum[];
  };

  /**
   * UserAiBotAccess create
   */
  export type UserAiBotAccessCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserAiBotAccess.
     */
    data: XOR<UserAiBotAccessCreateInput, UserAiBotAccessUncheckedCreateInput>;
  };

  /**
   * UserAiBotAccess createMany
   */
  export type UserAiBotAccessCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many UserAiBotAccesses.
     */
    data: UserAiBotAccessCreateManyInput | UserAiBotAccessCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * UserAiBotAccess createManyAndReturn
   */
  export type UserAiBotAccessCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * The data used to create many UserAiBotAccesses.
     */
    data: UserAiBotAccessCreateManyInput | UserAiBotAccessCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserAiBotAccess update
   */
  export type UserAiBotAccessUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserAiBotAccess.
     */
    data: XOR<UserAiBotAccessUpdateInput, UserAiBotAccessUncheckedUpdateInput>;
    /**
     * Choose, which UserAiBotAccess to update.
     */
    where: UserAiBotAccessWhereUniqueInput;
  };

  /**
   * UserAiBotAccess updateMany
   */
  export type UserAiBotAccessUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update UserAiBotAccesses.
     */
    data: XOR<UserAiBotAccessUpdateManyMutationInput, UserAiBotAccessUncheckedUpdateManyInput>;
    /**
     * Filter which UserAiBotAccesses to update
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * Limit how many UserAiBotAccesses to update.
     */
    limit?: number;
  };

  /**
   * UserAiBotAccess updateManyAndReturn
   */
  export type UserAiBotAccessUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * The data used to update UserAiBotAccesses.
     */
    data: XOR<UserAiBotAccessUpdateManyMutationInput, UserAiBotAccessUncheckedUpdateManyInput>;
    /**
     * Filter which UserAiBotAccesses to update
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * Limit how many UserAiBotAccesses to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * UserAiBotAccess upsert
   */
  export type UserAiBotAccessUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserAiBotAccess to update in case it exists.
     */
    where: UserAiBotAccessWhereUniqueInput;
    /**
     * In case the UserAiBotAccess found by the `where` argument doesn't exist, create a new UserAiBotAccess with this data.
     */
    create: XOR<UserAiBotAccessCreateInput, UserAiBotAccessUncheckedCreateInput>;
    /**
     * In case the UserAiBotAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAiBotAccessUpdateInput, UserAiBotAccessUncheckedUpdateInput>;
  };

  /**
   * UserAiBotAccess delete
   */
  export type UserAiBotAccessDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    /**
     * Filter which UserAiBotAccess to delete.
     */
    where: UserAiBotAccessWhereUniqueInput;
  };

  /**
   * UserAiBotAccess deleteMany
   */
  export type UserAiBotAccessDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which UserAiBotAccesses to delete
     */
    where?: UserAiBotAccessWhereInput;
    /**
     * Limit how many UserAiBotAccesses to delete.
     */
    limit?: number;
  };

  /**
   * UserAiBotAccess without action
   */
  export type UserAiBotAccessDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
  };

  /**
   * Model PaperlessInstance
   */

  export type AggregatePaperlessInstance = {
    _count: PaperlessInstanceCountAggregateOutputType | null;
    _min: PaperlessInstanceMinAggregateOutputType | null;
    _max: PaperlessInstanceMaxAggregateOutputType | null;
  };

  export type PaperlessInstanceMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    apiUrl: string | null;
    apiToken: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
  };

  export type PaperlessInstanceMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    apiUrl: string | null;
    apiToken: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
  };

  export type PaperlessInstanceCountAggregateOutputType = {
    id: number;
    name: number;
    apiUrl: number;
    apiToken: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    ownerId: number;
    _all: number;
  };

  export type PaperlessInstanceMinAggregateInputType = {
    id?: true;
    name?: true;
    apiUrl?: true;
    apiToken?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
  };

  export type PaperlessInstanceMaxAggregateInputType = {
    id?: true;
    name?: true;
    apiUrl?: true;
    apiToken?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
  };

  export type PaperlessInstanceCountAggregateInputType = {
    id?: true;
    name?: true;
    apiUrl?: true;
    apiToken?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
    _all?: true;
  };

  export type PaperlessInstanceAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PaperlessInstance to aggregate.
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaperlessInstances to fetch.
     */
    orderBy?:
      | PaperlessInstanceOrderByWithRelationInput
      | PaperlessInstanceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PaperlessInstanceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaperlessInstances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaperlessInstances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PaperlessInstances
     **/
    _count?: true | PaperlessInstanceCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PaperlessInstanceMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PaperlessInstanceMaxAggregateInputType;
  };

  export type GetPaperlessInstanceAggregateType<T extends PaperlessInstanceAggregateArgs> = {
    [P in keyof T & keyof AggregatePaperlessInstance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaperlessInstance[P]>
      : GetScalarType<T[P], AggregatePaperlessInstance[P]>;
  };

  export type PaperlessInstanceGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PaperlessInstanceWhereInput;
    orderBy?:
      | PaperlessInstanceOrderByWithAggregationInput
      | PaperlessInstanceOrderByWithAggregationInput[];
    by: PaperlessInstanceScalarFieldEnum[] | PaperlessInstanceScalarFieldEnum;
    having?: PaperlessInstanceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaperlessInstanceCountAggregateInputType | true;
    _min?: PaperlessInstanceMinAggregateInputType;
    _max?: PaperlessInstanceMaxAggregateInputType;
  };

  export type PaperlessInstanceGroupByOutputType = {
    id: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    _count: PaperlessInstanceCountAggregateOutputType | null;
    _min: PaperlessInstanceMinAggregateOutputType | null;
    _max: PaperlessInstanceMaxAggregateOutputType | null;
  };

  type GetPaperlessInstanceGroupByPayload<T extends PaperlessInstanceGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PaperlessInstanceGroupByOutputType, T['by']> & {
          [P in keyof T & keyof PaperlessInstanceGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaperlessInstanceGroupByOutputType[P]>
            : GetScalarType<T[P], PaperlessInstanceGroupByOutputType[P]>;
        }
      >
    >;

  export type PaperlessInstanceSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      apiUrl?: boolean;
      apiToken?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
      sharedWith?: boolean | PaperlessInstance$sharedWithArgs<ExtArgs>;
      processedDocuments?: boolean | PaperlessInstance$processedDocumentsArgs<ExtArgs>;
      processingQueue?: boolean | PaperlessInstance$processingQueueArgs<ExtArgs>;
      _count?: boolean | PaperlessInstanceCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['paperlessInstance']
  >;

  export type PaperlessInstanceSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      apiUrl?: boolean;
      apiToken?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['paperlessInstance']
  >;

  export type PaperlessInstanceSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      apiUrl?: boolean;
      apiToken?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['paperlessInstance']
  >;

  export type PaperlessInstanceSelectScalar = {
    id?: boolean;
    name?: boolean;
    apiUrl?: boolean;
    apiToken?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ownerId?: boolean;
  };

  export type PaperlessInstanceOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'name' | 'apiUrl' | 'apiToken' | 'isActive' | 'createdAt' | 'updatedAt' | 'ownerId',
    ExtArgs['result']['paperlessInstance']
  >;
  export type PaperlessInstanceInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    sharedWith?: boolean | PaperlessInstance$sharedWithArgs<ExtArgs>;
    processedDocuments?: boolean | PaperlessInstance$processedDocumentsArgs<ExtArgs>;
    processingQueue?: boolean | PaperlessInstance$processingQueueArgs<ExtArgs>;
    _count?: boolean | PaperlessInstanceCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type PaperlessInstanceIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PaperlessInstanceIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $PaperlessInstancePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PaperlessInstance';
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>;
      sharedWith: Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>[];
      processedDocuments: Prisma.$ProcessedDocumentPayload<ExtArgs>[];
      processingQueue: Prisma.$ProcessingQueuePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        apiUrl: string;
        apiToken: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
      },
      ExtArgs['result']['paperlessInstance']
    >;
    composites: {};
  };

  type PaperlessInstanceGetPayload<
    S extends boolean | null | undefined | PaperlessInstanceDefaultArgs,
  > = $Result.GetResult<Prisma.$PaperlessInstancePayload, S>;

  type PaperlessInstanceCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PaperlessInstanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaperlessInstanceCountAggregateInputType | true;
  };

  export interface PaperlessInstanceDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PaperlessInstance'];
      meta: { name: 'PaperlessInstance' };
    };
    /**
     * Find zero or one PaperlessInstance that matches the filter.
     * @param {PaperlessInstanceFindUniqueArgs} args - Arguments to find a PaperlessInstance
     * @example
     * // Get one PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaperlessInstanceFindUniqueArgs>(
      args: SelectSubset<T, PaperlessInstanceFindUniqueArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one PaperlessInstance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaperlessInstanceFindUniqueOrThrowArgs} args - Arguments to find a PaperlessInstance
     * @example
     * // Get one PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaperlessInstanceFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PaperlessInstanceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first PaperlessInstance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceFindFirstArgs} args - Arguments to find a PaperlessInstance
     * @example
     * // Get one PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaperlessInstanceFindFirstArgs>(
      args?: SelectSubset<T, PaperlessInstanceFindFirstArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first PaperlessInstance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceFindFirstOrThrowArgs} args - Arguments to find a PaperlessInstance
     * @example
     * // Get one PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaperlessInstanceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PaperlessInstanceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more PaperlessInstances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaperlessInstances
     * const paperlessInstances = await prisma.paperlessInstance.findMany()
     *
     * // Get first 10 PaperlessInstances
     * const paperlessInstances = await prisma.paperlessInstance.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const paperlessInstanceWithIdOnly = await prisma.paperlessInstance.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PaperlessInstanceFindManyArgs>(
      args?: SelectSubset<T, PaperlessInstanceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$PaperlessInstancePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a PaperlessInstance.
     * @param {PaperlessInstanceCreateArgs} args - Arguments to create a PaperlessInstance.
     * @example
     * // Create one PaperlessInstance
     * const PaperlessInstance = await prisma.paperlessInstance.create({
     *   data: {
     *     // ... data to create a PaperlessInstance
     *   }
     * })
     *
     */
    create<T extends PaperlessInstanceCreateArgs>(
      args: SelectSubset<T, PaperlessInstanceCreateArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<Prisma.$PaperlessInstancePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many PaperlessInstances.
     * @param {PaperlessInstanceCreateManyArgs} args - Arguments to create many PaperlessInstances.
     * @example
     * // Create many PaperlessInstances
     * const paperlessInstance = await prisma.paperlessInstance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PaperlessInstanceCreateManyArgs>(
      args?: SelectSubset<T, PaperlessInstanceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many PaperlessInstances and returns the data saved in the database.
     * @param {PaperlessInstanceCreateManyAndReturnArgs} args - Arguments to create many PaperlessInstances.
     * @example
     * // Create many PaperlessInstances
     * const paperlessInstance = await prisma.paperlessInstance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PaperlessInstances and only return the `id`
     * const paperlessInstanceWithIdOnly = await prisma.paperlessInstance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PaperlessInstanceCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PaperlessInstanceCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a PaperlessInstance.
     * @param {PaperlessInstanceDeleteArgs} args - Arguments to delete one PaperlessInstance.
     * @example
     * // Delete one PaperlessInstance
     * const PaperlessInstance = await prisma.paperlessInstance.delete({
     *   where: {
     *     // ... filter to delete one PaperlessInstance
     *   }
     * })
     *
     */
    delete<T extends PaperlessInstanceDeleteArgs>(
      args: SelectSubset<T, PaperlessInstanceDeleteArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<Prisma.$PaperlessInstancePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one PaperlessInstance.
     * @param {PaperlessInstanceUpdateArgs} args - Arguments to update one PaperlessInstance.
     * @example
     * // Update one PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PaperlessInstanceUpdateArgs>(
      args: SelectSubset<T, PaperlessInstanceUpdateArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<Prisma.$PaperlessInstancePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more PaperlessInstances.
     * @param {PaperlessInstanceDeleteManyArgs} args - Arguments to filter PaperlessInstances to delete.
     * @example
     * // Delete a few PaperlessInstances
     * const { count } = await prisma.paperlessInstance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PaperlessInstanceDeleteManyArgs>(
      args?: SelectSubset<T, PaperlessInstanceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PaperlessInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaperlessInstances
     * const paperlessInstance = await prisma.paperlessInstance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PaperlessInstanceUpdateManyArgs>(
      args: SelectSubset<T, PaperlessInstanceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PaperlessInstances and returns the data updated in the database.
     * @param {PaperlessInstanceUpdateManyAndReturnArgs} args - Arguments to update many PaperlessInstances.
     * @example
     * // Update many PaperlessInstances
     * const paperlessInstance = await prisma.paperlessInstance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PaperlessInstances and only return the `id`
     * const paperlessInstanceWithIdOnly = await prisma.paperlessInstance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PaperlessInstanceUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PaperlessInstanceUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PaperlessInstancePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one PaperlessInstance.
     * @param {PaperlessInstanceUpsertArgs} args - Arguments to update or create a PaperlessInstance.
     * @example
     * // Update or create a PaperlessInstance
     * const paperlessInstance = await prisma.paperlessInstance.upsert({
     *   create: {
     *     // ... data to create a PaperlessInstance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaperlessInstance we want to update
     *   }
     * })
     */
    upsert<T extends PaperlessInstanceUpsertArgs>(
      args: SelectSubset<T, PaperlessInstanceUpsertArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      $Result.GetResult<Prisma.$PaperlessInstancePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of PaperlessInstances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceCountArgs} args - Arguments to filter PaperlessInstances to count.
     * @example
     * // Count the number of PaperlessInstances
     * const count = await prisma.paperlessInstance.count({
     *   where: {
     *     // ... the filter for the PaperlessInstances we want to count
     *   }
     * })
     **/
    count<T extends PaperlessInstanceCountArgs>(
      args?: Subset<T, PaperlessInstanceCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaperlessInstanceCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a PaperlessInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PaperlessInstanceAggregateArgs>(
      args: Subset<T, PaperlessInstanceAggregateArgs>
    ): Prisma.PrismaPromise<GetPaperlessInstanceAggregateType<T>>;

    /**
     * Group by PaperlessInstance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperlessInstanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PaperlessInstanceGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaperlessInstanceGroupByArgs['orderBy'] }
        : { orderBy?: PaperlessInstanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PaperlessInstanceGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetPaperlessInstanceGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PaperlessInstance model
     */
    readonly fields: PaperlessInstanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaperlessInstance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaperlessInstanceClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    sharedWith<T extends PaperlessInstance$sharedWithArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstance$sharedWithArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$UserPaperlessInstanceAccessPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    processedDocuments<T extends PaperlessInstance$processedDocumentsArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstance$processedDocumentsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ProcessedDocumentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    processingQueue<T extends PaperlessInstance$processingQueueArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstance$processingQueueArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the PaperlessInstance model
   */
  interface PaperlessInstanceFieldRefs {
    readonly id: FieldRef<'PaperlessInstance', 'String'>;
    readonly name: FieldRef<'PaperlessInstance', 'String'>;
    readonly apiUrl: FieldRef<'PaperlessInstance', 'String'>;
    readonly apiToken: FieldRef<'PaperlessInstance', 'String'>;
    readonly isActive: FieldRef<'PaperlessInstance', 'Boolean'>;
    readonly createdAt: FieldRef<'PaperlessInstance', 'DateTime'>;
    readonly updatedAt: FieldRef<'PaperlessInstance', 'DateTime'>;
    readonly ownerId: FieldRef<'PaperlessInstance', 'String'>;
  }

  // Custom InputTypes
  /**
   * PaperlessInstance findUnique
   */
  export type PaperlessInstanceFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter, which PaperlessInstance to fetch.
     */
    where: PaperlessInstanceWhereUniqueInput;
  };

  /**
   * PaperlessInstance findUniqueOrThrow
   */
  export type PaperlessInstanceFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter, which PaperlessInstance to fetch.
     */
    where: PaperlessInstanceWhereUniqueInput;
  };

  /**
   * PaperlessInstance findFirst
   */
  export type PaperlessInstanceFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter, which PaperlessInstance to fetch.
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaperlessInstances to fetch.
     */
    orderBy?:
      | PaperlessInstanceOrderByWithRelationInput
      | PaperlessInstanceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaperlessInstances.
     */
    cursor?: PaperlessInstanceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaperlessInstances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaperlessInstances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaperlessInstances.
     */
    distinct?: PaperlessInstanceScalarFieldEnum | PaperlessInstanceScalarFieldEnum[];
  };

  /**
   * PaperlessInstance findFirstOrThrow
   */
  export type PaperlessInstanceFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter, which PaperlessInstance to fetch.
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaperlessInstances to fetch.
     */
    orderBy?:
      | PaperlessInstanceOrderByWithRelationInput
      | PaperlessInstanceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PaperlessInstances.
     */
    cursor?: PaperlessInstanceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaperlessInstances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaperlessInstances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PaperlessInstances.
     */
    distinct?: PaperlessInstanceScalarFieldEnum | PaperlessInstanceScalarFieldEnum[];
  };

  /**
   * PaperlessInstance findMany
   */
  export type PaperlessInstanceFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter, which PaperlessInstances to fetch.
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PaperlessInstances to fetch.
     */
    orderBy?:
      | PaperlessInstanceOrderByWithRelationInput
      | PaperlessInstanceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PaperlessInstances.
     */
    cursor?: PaperlessInstanceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PaperlessInstances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PaperlessInstances.
     */
    skip?: number;
    distinct?: PaperlessInstanceScalarFieldEnum | PaperlessInstanceScalarFieldEnum[];
  };

  /**
   * PaperlessInstance create
   */
  export type PaperlessInstanceCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * The data needed to create a PaperlessInstance.
     */
    data: XOR<PaperlessInstanceCreateInput, PaperlessInstanceUncheckedCreateInput>;
  };

  /**
   * PaperlessInstance createMany
   */
  export type PaperlessInstanceCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PaperlessInstances.
     */
    data: PaperlessInstanceCreateManyInput | PaperlessInstanceCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * PaperlessInstance createManyAndReturn
   */
  export type PaperlessInstanceCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * The data used to create many PaperlessInstances.
     */
    data: PaperlessInstanceCreateManyInput | PaperlessInstanceCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * PaperlessInstance update
   */
  export type PaperlessInstanceUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * The data needed to update a PaperlessInstance.
     */
    data: XOR<PaperlessInstanceUpdateInput, PaperlessInstanceUncheckedUpdateInput>;
    /**
     * Choose, which PaperlessInstance to update.
     */
    where: PaperlessInstanceWhereUniqueInput;
  };

  /**
   * PaperlessInstance updateMany
   */
  export type PaperlessInstanceUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PaperlessInstances.
     */
    data: XOR<PaperlessInstanceUpdateManyMutationInput, PaperlessInstanceUncheckedUpdateManyInput>;
    /**
     * Filter which PaperlessInstances to update
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * Limit how many PaperlessInstances to update.
     */
    limit?: number;
  };

  /**
   * PaperlessInstance updateManyAndReturn
   */
  export type PaperlessInstanceUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * The data used to update PaperlessInstances.
     */
    data: XOR<PaperlessInstanceUpdateManyMutationInput, PaperlessInstanceUncheckedUpdateManyInput>;
    /**
     * Filter which PaperlessInstances to update
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * Limit how many PaperlessInstances to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * PaperlessInstance upsert
   */
  export type PaperlessInstanceUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * The filter to search for the PaperlessInstance to update in case it exists.
     */
    where: PaperlessInstanceWhereUniqueInput;
    /**
     * In case the PaperlessInstance found by the `where` argument doesn't exist, create a new PaperlessInstance with this data.
     */
    create: XOR<PaperlessInstanceCreateInput, PaperlessInstanceUncheckedCreateInput>;
    /**
     * In case the PaperlessInstance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaperlessInstanceUpdateInput, PaperlessInstanceUncheckedUpdateInput>;
  };

  /**
   * PaperlessInstance delete
   */
  export type PaperlessInstanceDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
    /**
     * Filter which PaperlessInstance to delete.
     */
    where: PaperlessInstanceWhereUniqueInput;
  };

  /**
   * PaperlessInstance deleteMany
   */
  export type PaperlessInstanceDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PaperlessInstances to delete
     */
    where?: PaperlessInstanceWhereInput;
    /**
     * Limit how many PaperlessInstances to delete.
     */
    limit?: number;
  };

  /**
   * PaperlessInstance.sharedWith
   */
  export type PaperlessInstance$sharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserPaperlessInstanceAccess
     */
    select?: UserPaperlessInstanceAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPaperlessInstanceAccess
     */
    omit?: UserPaperlessInstanceAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPaperlessInstanceAccessInclude<ExtArgs> | null;
    where?: UserPaperlessInstanceAccessWhereInput;
    orderBy?:
      | UserPaperlessInstanceAccessOrderByWithRelationInput
      | UserPaperlessInstanceAccessOrderByWithRelationInput[];
    cursor?: UserPaperlessInstanceAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | UserPaperlessInstanceAccessScalarFieldEnum
      | UserPaperlessInstanceAccessScalarFieldEnum[];
  };

  /**
   * PaperlessInstance.processedDocuments
   */
  export type PaperlessInstance$processedDocumentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    where?: ProcessedDocumentWhereInput;
    orderBy?:
      | ProcessedDocumentOrderByWithRelationInput
      | ProcessedDocumentOrderByWithRelationInput[];
    cursor?: ProcessedDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProcessedDocumentScalarFieldEnum | ProcessedDocumentScalarFieldEnum[];
  };

  /**
   * PaperlessInstance.processingQueue
   */
  export type PaperlessInstance$processingQueueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    where?: ProcessingQueueWhereInput;
    orderBy?: ProcessingQueueOrderByWithRelationInput | ProcessingQueueOrderByWithRelationInput[];
    cursor?: ProcessingQueueWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProcessingQueueScalarFieldEnum | ProcessingQueueScalarFieldEnum[];
  };

  /**
   * PaperlessInstance without action
   */
  export type PaperlessInstanceDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaperlessInstance
     */
    select?: PaperlessInstanceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PaperlessInstance
     */
    omit?: PaperlessInstanceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperlessInstanceInclude<ExtArgs> | null;
  };

  /**
   * Model AiProvider
   */

  export type AggregateAiProvider = {
    _count: AiProviderCountAggregateOutputType | null;
    _min: AiProviderMinAggregateOutputType | null;
    _max: AiProviderMaxAggregateOutputType | null;
  };

  export type AiProviderMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    provider: string | null;
    model: string | null;
    apiKey: string | null;
    baseUrl: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
  };

  export type AiProviderMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    provider: string | null;
    model: string | null;
    apiKey: string | null;
    baseUrl: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
  };

  export type AiProviderCountAggregateOutputType = {
    id: number;
    name: number;
    provider: number;
    model: number;
    apiKey: number;
    baseUrl: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    ownerId: number;
    _all: number;
  };

  export type AiProviderMinAggregateInputType = {
    id?: true;
    name?: true;
    provider?: true;
    model?: true;
    apiKey?: true;
    baseUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
  };

  export type AiProviderMaxAggregateInputType = {
    id?: true;
    name?: true;
    provider?: true;
    model?: true;
    apiKey?: true;
    baseUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
  };

  export type AiProviderCountAggregateInputType = {
    id?: true;
    name?: true;
    provider?: true;
    model?: true;
    apiKey?: true;
    baseUrl?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
    _all?: true;
  };

  export type AiProviderAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiProvider to aggregate.
     */
    where?: AiProviderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiProviders to fetch.
     */
    orderBy?: AiProviderOrderByWithRelationInput | AiProviderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AiProviderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiProviders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiProviders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AiProviders
     **/
    _count?: true | AiProviderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AiProviderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AiProviderMaxAggregateInputType;
  };

  export type GetAiProviderAggregateType<T extends AiProviderAggregateArgs> = {
    [P in keyof T & keyof AggregateAiProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiProvider[P]>
      : GetScalarType<T[P], AggregateAiProvider[P]>;
  };

  export type AiProviderGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiProviderWhereInput;
    orderBy?: AiProviderOrderByWithAggregationInput | AiProviderOrderByWithAggregationInput[];
    by: AiProviderScalarFieldEnum[] | AiProviderScalarFieldEnum;
    having?: AiProviderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiProviderCountAggregateInputType | true;
    _min?: AiProviderMinAggregateInputType;
    _max?: AiProviderMaxAggregateInputType;
  };

  export type AiProviderGroupByOutputType = {
    id: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    _count: AiProviderCountAggregateOutputType | null;
    _min: AiProviderMinAggregateOutputType | null;
    _max: AiProviderMaxAggregateOutputType | null;
  };

  type GetAiProviderGroupByPayload<T extends AiProviderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiProviderGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AiProviderGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AiProviderGroupByOutputType[P]>
          : GetScalarType<T[P], AiProviderGroupByOutputType[P]>;
      }
    >
  >;

  export type AiProviderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        provider?: boolean;
        model?: boolean;
        apiKey?: boolean;
        baseUrl?: boolean;
        isActive?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        ownerId?: boolean;
        owner?: boolean | UserDefaultArgs<ExtArgs>;
        sharedWith?: boolean | AiProvider$sharedWithArgs<ExtArgs>;
        bots?: boolean | AiProvider$botsArgs<ExtArgs>;
        _count?: boolean | AiProviderCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['aiProvider']
    >;

  export type AiProviderSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      provider?: boolean;
      model?: boolean;
      apiKey?: boolean;
      baseUrl?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['aiProvider']
  >;

  export type AiProviderSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      provider?: boolean;
      model?: boolean;
      apiKey?: boolean;
      baseUrl?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['aiProvider']
  >;

  export type AiProviderSelectScalar = {
    id?: boolean;
    name?: boolean;
    provider?: boolean;
    model?: boolean;
    apiKey?: boolean;
    baseUrl?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ownerId?: boolean;
  };

  export type AiProviderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'name'
      | 'provider'
      | 'model'
      | 'apiKey'
      | 'baseUrl'
      | 'isActive'
      | 'createdAt'
      | 'updatedAt'
      | 'ownerId',
      ExtArgs['result']['aiProvider']
    >;
  export type AiProviderInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    sharedWith?: boolean | AiProvider$sharedWithArgs<ExtArgs>;
    bots?: boolean | AiProvider$botsArgs<ExtArgs>;
    _count?: boolean | AiProviderCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type AiProviderIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AiProviderIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $AiProviderPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AiProvider';
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>;
      sharedWith: Prisma.$UserAiProviderAccessPayload<ExtArgs>[];
      bots: Prisma.$AiBotPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        provider: string;
        model: string;
        apiKey: string;
        baseUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
      },
      ExtArgs['result']['aiProvider']
    >;
    composites: {};
  };

  type AiProviderGetPayload<S extends boolean | null | undefined | AiProviderDefaultArgs> =
    $Result.GetResult<Prisma.$AiProviderPayload, S>;

  type AiProviderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiProviderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiProviderCountAggregateInputType | true;
    };

  export interface AiProviderDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AiProvider'];
      meta: { name: 'AiProvider' };
    };
    /**
     * Find zero or one AiProvider that matches the filter.
     * @param {AiProviderFindUniqueArgs} args - Arguments to find a AiProvider
     * @example
     * // Get one AiProvider
     * const aiProvider = await prisma.aiProvider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiProviderFindUniqueArgs>(
      args: SelectSubset<T, AiProviderFindUniqueArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AiProvider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiProviderFindUniqueOrThrowArgs} args - Arguments to find a AiProvider
     * @example
     * // Get one AiProvider
     * const aiProvider = await prisma.aiProvider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiProviderFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AiProviderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiProvider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderFindFirstArgs} args - Arguments to find a AiProvider
     * @example
     * // Get one AiProvider
     * const aiProvider = await prisma.aiProvider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiProviderFindFirstArgs>(
      args?: SelectSubset<T, AiProviderFindFirstArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiProvider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderFindFirstOrThrowArgs} args - Arguments to find a AiProvider
     * @example
     * // Get one AiProvider
     * const aiProvider = await prisma.aiProvider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiProviderFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AiProviderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AiProviders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiProviders
     * const aiProviders = await prisma.aiProvider.findMany()
     *
     * // Get first 10 AiProviders
     * const aiProviders = await prisma.aiProvider.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const aiProviderWithIdOnly = await prisma.aiProvider.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AiProviderFindManyArgs>(
      args?: SelectSubset<T, AiProviderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a AiProvider.
     * @param {AiProviderCreateArgs} args - Arguments to create a AiProvider.
     * @example
     * // Create one AiProvider
     * const AiProvider = await prisma.aiProvider.create({
     *   data: {
     *     // ... data to create a AiProvider
     *   }
     * })
     *
     */
    create<T extends AiProviderCreateArgs>(
      args: SelectSubset<T, AiProviderCreateArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AiProviders.
     * @param {AiProviderCreateManyArgs} args - Arguments to create many AiProviders.
     * @example
     * // Create many AiProviders
     * const aiProvider = await prisma.aiProvider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AiProviderCreateManyArgs>(
      args?: SelectSubset<T, AiProviderCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AiProviders and returns the data saved in the database.
     * @param {AiProviderCreateManyAndReturnArgs} args - Arguments to create many AiProviders.
     * @example
     * // Create many AiProviders
     * const aiProvider = await prisma.aiProvider.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AiProviders and only return the `id`
     * const aiProviderWithIdOnly = await prisma.aiProvider.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AiProviderCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AiProviderCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a AiProvider.
     * @param {AiProviderDeleteArgs} args - Arguments to delete one AiProvider.
     * @example
     * // Delete one AiProvider
     * const AiProvider = await prisma.aiProvider.delete({
     *   where: {
     *     // ... filter to delete one AiProvider
     *   }
     * })
     *
     */
    delete<T extends AiProviderDeleteArgs>(
      args: SelectSubset<T, AiProviderDeleteArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AiProvider.
     * @param {AiProviderUpdateArgs} args - Arguments to update one AiProvider.
     * @example
     * // Update one AiProvider
     * const aiProvider = await prisma.aiProvider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AiProviderUpdateArgs>(
      args: SelectSubset<T, AiProviderUpdateArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AiProviders.
     * @param {AiProviderDeleteManyArgs} args - Arguments to filter AiProviders to delete.
     * @example
     * // Delete a few AiProviders
     * const { count } = await prisma.aiProvider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AiProviderDeleteManyArgs>(
      args?: SelectSubset<T, AiProviderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiProviders
     * const aiProvider = await prisma.aiProvider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AiProviderUpdateManyArgs>(
      args: SelectSubset<T, AiProviderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiProviders and returns the data updated in the database.
     * @param {AiProviderUpdateManyAndReturnArgs} args - Arguments to update many AiProviders.
     * @example
     * // Update many AiProviders
     * const aiProvider = await prisma.aiProvider.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AiProviders and only return the `id`
     * const aiProviderWithIdOnly = await prisma.aiProvider.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AiProviderUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AiProviderUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AiProviderPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one AiProvider.
     * @param {AiProviderUpsertArgs} args - Arguments to update or create a AiProvider.
     * @example
     * // Update or create a AiProvider
     * const aiProvider = await prisma.aiProvider.upsert({
     *   create: {
     *     // ... data to create a AiProvider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiProvider we want to update
     *   }
     * })
     */
    upsert<T extends AiProviderUpsertArgs>(
      args: SelectSubset<T, AiProviderUpsertArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      $Result.GetResult<Prisma.$AiProviderPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of AiProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderCountArgs} args - Arguments to filter AiProviders to count.
     * @example
     * // Count the number of AiProviders
     * const count = await prisma.aiProvider.count({
     *   where: {
     *     // ... the filter for the AiProviders we want to count
     *   }
     * })
     **/
    count<T extends AiProviderCountArgs>(
      args?: Subset<T, AiProviderCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiProviderCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AiProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AiProviderAggregateArgs>(
      args: Subset<T, AiProviderAggregateArgs>
    ): Prisma.PrismaPromise<GetAiProviderAggregateType<T>>;

    /**
     * Group by AiProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiProviderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AiProviderGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiProviderGroupByArgs['orderBy'] }
        : { orderBy?: AiProviderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AiProviderGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetAiProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AiProvider model
     */
    readonly fields: AiProviderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiProvider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiProviderClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    sharedWith<T extends AiProvider$sharedWithArgs<ExtArgs> = {}>(
      args?: Subset<T, AiProvider$sharedWithArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$UserAiProviderAccessPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    bots<T extends AiProvider$botsArgs<ExtArgs> = {}>(
      args?: Subset<T, AiProvider$botsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AiProvider model
   */
  interface AiProviderFieldRefs {
    readonly id: FieldRef<'AiProvider', 'String'>;
    readonly name: FieldRef<'AiProvider', 'String'>;
    readonly provider: FieldRef<'AiProvider', 'String'>;
    readonly model: FieldRef<'AiProvider', 'String'>;
    readonly apiKey: FieldRef<'AiProvider', 'String'>;
    readonly baseUrl: FieldRef<'AiProvider', 'String'>;
    readonly isActive: FieldRef<'AiProvider', 'Boolean'>;
    readonly createdAt: FieldRef<'AiProvider', 'DateTime'>;
    readonly updatedAt: FieldRef<'AiProvider', 'DateTime'>;
    readonly ownerId: FieldRef<'AiProvider', 'String'>;
  }

  // Custom InputTypes
  /**
   * AiProvider findUnique
   */
  export type AiProviderFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter, which AiProvider to fetch.
     */
    where: AiProviderWhereUniqueInput;
  };

  /**
   * AiProvider findUniqueOrThrow
   */
  export type AiProviderFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter, which AiProvider to fetch.
     */
    where: AiProviderWhereUniqueInput;
  };

  /**
   * AiProvider findFirst
   */
  export type AiProviderFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter, which AiProvider to fetch.
     */
    where?: AiProviderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiProviders to fetch.
     */
    orderBy?: AiProviderOrderByWithRelationInput | AiProviderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiProviders.
     */
    cursor?: AiProviderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiProviders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiProviders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiProviders.
     */
    distinct?: AiProviderScalarFieldEnum | AiProviderScalarFieldEnum[];
  };

  /**
   * AiProvider findFirstOrThrow
   */
  export type AiProviderFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter, which AiProvider to fetch.
     */
    where?: AiProviderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiProviders to fetch.
     */
    orderBy?: AiProviderOrderByWithRelationInput | AiProviderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiProviders.
     */
    cursor?: AiProviderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiProviders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiProviders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiProviders.
     */
    distinct?: AiProviderScalarFieldEnum | AiProviderScalarFieldEnum[];
  };

  /**
   * AiProvider findMany
   */
  export type AiProviderFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter, which AiProviders to fetch.
     */
    where?: AiProviderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiProviders to fetch.
     */
    orderBy?: AiProviderOrderByWithRelationInput | AiProviderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AiProviders.
     */
    cursor?: AiProviderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiProviders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiProviders.
     */
    skip?: number;
    distinct?: AiProviderScalarFieldEnum | AiProviderScalarFieldEnum[];
  };

  /**
   * AiProvider create
   */
  export type AiProviderCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * The data needed to create a AiProvider.
     */
    data: XOR<AiProviderCreateInput, AiProviderUncheckedCreateInput>;
  };

  /**
   * AiProvider createMany
   */
  export type AiProviderCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AiProviders.
     */
    data: AiProviderCreateManyInput | AiProviderCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AiProvider createManyAndReturn
   */
  export type AiProviderCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * The data used to create many AiProviders.
     */
    data: AiProviderCreateManyInput | AiProviderCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiProvider update
   */
  export type AiProviderUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * The data needed to update a AiProvider.
     */
    data: XOR<AiProviderUpdateInput, AiProviderUncheckedUpdateInput>;
    /**
     * Choose, which AiProvider to update.
     */
    where: AiProviderWhereUniqueInput;
  };

  /**
   * AiProvider updateMany
   */
  export type AiProviderUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AiProviders.
     */
    data: XOR<AiProviderUpdateManyMutationInput, AiProviderUncheckedUpdateManyInput>;
    /**
     * Filter which AiProviders to update
     */
    where?: AiProviderWhereInput;
    /**
     * Limit how many AiProviders to update.
     */
    limit?: number;
  };

  /**
   * AiProvider updateManyAndReturn
   */
  export type AiProviderUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * The data used to update AiProviders.
     */
    data: XOR<AiProviderUpdateManyMutationInput, AiProviderUncheckedUpdateManyInput>;
    /**
     * Filter which AiProviders to update
     */
    where?: AiProviderWhereInput;
    /**
     * Limit how many AiProviders to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiProvider upsert
   */
  export type AiProviderUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * The filter to search for the AiProvider to update in case it exists.
     */
    where: AiProviderWhereUniqueInput;
    /**
     * In case the AiProvider found by the `where` argument doesn't exist, create a new AiProvider with this data.
     */
    create: XOR<AiProviderCreateInput, AiProviderUncheckedCreateInput>;
    /**
     * In case the AiProvider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiProviderUpdateInput, AiProviderUncheckedUpdateInput>;
  };

  /**
   * AiProvider delete
   */
  export type AiProviderDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
    /**
     * Filter which AiProvider to delete.
     */
    where: AiProviderWhereUniqueInput;
  };

  /**
   * AiProvider deleteMany
   */
  export type AiProviderDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiProviders to delete
     */
    where?: AiProviderWhereInput;
    /**
     * Limit how many AiProviders to delete.
     */
    limit?: number;
  };

  /**
   * AiProvider.sharedWith
   */
  export type AiProvider$sharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiProviderAccess
     */
    select?: UserAiProviderAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiProviderAccess
     */
    omit?: UserAiProviderAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiProviderAccessInclude<ExtArgs> | null;
    where?: UserAiProviderAccessWhereInput;
    orderBy?:
      | UserAiProviderAccessOrderByWithRelationInput
      | UserAiProviderAccessOrderByWithRelationInput[];
    cursor?: UserAiProviderAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserAiProviderAccessScalarFieldEnum | UserAiProviderAccessScalarFieldEnum[];
  };

  /**
   * AiProvider.bots
   */
  export type AiProvider$botsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    where?: AiBotWhereInput;
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    cursor?: AiBotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AiBotScalarFieldEnum | AiBotScalarFieldEnum[];
  };

  /**
   * AiProvider without action
   */
  export type AiProviderDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiProvider
     */
    select?: AiProviderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiProvider
     */
    omit?: AiProviderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiProviderInclude<ExtArgs> | null;
  };

  /**
   * Model AiBot
   */

  export type AggregateAiBot = {
    _count: AiBotCountAggregateOutputType | null;
    _min: AiBotMinAggregateOutputType | null;
    _max: AiBotMaxAggregateOutputType | null;
  };

  export type AiBotMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    systemPrompt: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
    aiProviderId: string | null;
  };

  export type AiBotMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    systemPrompt: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    ownerId: string | null;
    aiProviderId: string | null;
  };

  export type AiBotCountAggregateOutputType = {
    id: number;
    name: number;
    systemPrompt: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    ownerId: number;
    aiProviderId: number;
    _all: number;
  };

  export type AiBotMinAggregateInputType = {
    id?: true;
    name?: true;
    systemPrompt?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
    aiProviderId?: true;
  };

  export type AiBotMaxAggregateInputType = {
    id?: true;
    name?: true;
    systemPrompt?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
    aiProviderId?: true;
  };

  export type AiBotCountAggregateInputType = {
    id?: true;
    name?: true;
    systemPrompt?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    ownerId?: true;
    aiProviderId?: true;
    _all?: true;
  };

  export type AiBotAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiBot to aggregate.
     */
    where?: AiBotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiBots to fetch.
     */
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AiBotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiBots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiBots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AiBots
     **/
    _count?: true | AiBotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AiBotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AiBotMaxAggregateInputType;
  };

  export type GetAiBotAggregateType<T extends AiBotAggregateArgs> = {
    [P in keyof T & keyof AggregateAiBot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiBot[P]>
      : GetScalarType<T[P], AggregateAiBot[P]>;
  };

  export type AiBotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: AiBotWhereInput;
      orderBy?: AiBotOrderByWithAggregationInput | AiBotOrderByWithAggregationInput[];
      by: AiBotScalarFieldEnum[] | AiBotScalarFieldEnum;
      having?: AiBotScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: AiBotCountAggregateInputType | true;
      _min?: AiBotMinAggregateInputType;
      _max?: AiBotMaxAggregateInputType;
    };

  export type AiBotGroupByOutputType = {
    id: string;
    name: string;
    systemPrompt: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    aiProviderId: string;
    _count: AiBotCountAggregateOutputType | null;
    _min: AiBotMinAggregateOutputType | null;
    _max: AiBotMaxAggregateOutputType | null;
  };

  type GetAiBotGroupByPayload<T extends AiBotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiBotGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AiBotGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AiBotGroupByOutputType[P]>
          : GetScalarType<T[P], AiBotGroupByOutputType[P]>;
      }
    >
  >;

  export type AiBotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        systemPrompt?: boolean;
        isActive?: boolean;
        createdAt?: boolean;
        updatedAt?: boolean;
        ownerId?: boolean;
        aiProviderId?: boolean;
        owner?: boolean | UserDefaultArgs<ExtArgs>;
        aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
        sharedWith?: boolean | AiBot$sharedWithArgs<ExtArgs>;
        aiUsageMetrics?: boolean | AiBot$aiUsageMetricsArgs<ExtArgs>;
        _count?: boolean | AiBotCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['aiBot']
    >;

  export type AiBotSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      systemPrompt?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      aiProviderId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
      aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['aiBot']
  >;

  export type AiBotSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      systemPrompt?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      ownerId?: boolean;
      aiProviderId?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
      aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['aiBot']
  >;

  export type AiBotSelectScalar = {
    id?: boolean;
    name?: boolean;
    systemPrompt?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    ownerId?: boolean;
    aiProviderId?: boolean;
  };

  export type AiBotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'name'
      | 'systemPrompt'
      | 'isActive'
      | 'createdAt'
      | 'updatedAt'
      | 'ownerId'
      | 'aiProviderId',
      ExtArgs['result']['aiBot']
    >;
  export type AiBotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
    sharedWith?: boolean | AiBot$sharedWithArgs<ExtArgs>;
    aiUsageMetrics?: boolean | AiBot$aiUsageMetricsArgs<ExtArgs>;
    _count?: boolean | AiBotCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type AiBotIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
  };
  export type AiBotIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    aiProvider?: boolean | AiProviderDefaultArgs<ExtArgs>;
  };

  export type $AiBotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'AiBot';
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>;
      aiProvider: Prisma.$AiProviderPayload<ExtArgs>;
      sharedWith: Prisma.$UserAiBotAccessPayload<ExtArgs>[];
      aiUsageMetrics: Prisma.$AiUsageMetricPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        systemPrompt: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        aiProviderId: string;
      },
      ExtArgs['result']['aiBot']
    >;
    composites: {};
  };

  type AiBotGetPayload<S extends boolean | null | undefined | AiBotDefaultArgs> = $Result.GetResult<
    Prisma.$AiBotPayload,
    S
  >;

  type AiBotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AiBotFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: AiBotCountAggregateInputType | true;
  };

  export interface AiBotDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiBot']; meta: { name: 'AiBot' } };
    /**
     * Find zero or one AiBot that matches the filter.
     * @param {AiBotFindUniqueArgs} args - Arguments to find a AiBot
     * @example
     * // Get one AiBot
     * const aiBot = await prisma.aiBot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiBotFindUniqueArgs>(
      args: SelectSubset<T, AiBotFindUniqueArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AiBot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiBotFindUniqueOrThrowArgs} args - Arguments to find a AiBot
     * @example
     * // Get one AiBot
     * const aiBot = await prisma.aiBot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiBotFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AiBotFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiBot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotFindFirstArgs} args - Arguments to find a AiBot
     * @example
     * // Get one AiBot
     * const aiBot = await prisma.aiBot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiBotFindFirstArgs>(
      args?: SelectSubset<T, AiBotFindFirstArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiBot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotFindFirstOrThrowArgs} args - Arguments to find a AiBot
     * @example
     * // Get one AiBot
     * const aiBot = await prisma.aiBot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiBotFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AiBotFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AiBots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiBots
     * const aiBots = await prisma.aiBot.findMany()
     *
     * // Get first 10 AiBots
     * const aiBots = await prisma.aiBot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const aiBotWithIdOnly = await prisma.aiBot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AiBotFindManyArgs>(
      args?: SelectSubset<T, AiBotFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a AiBot.
     * @param {AiBotCreateArgs} args - Arguments to create a AiBot.
     * @example
     * // Create one AiBot
     * const AiBot = await prisma.aiBot.create({
     *   data: {
     *     // ... data to create a AiBot
     *   }
     * })
     *
     */
    create<T extends AiBotCreateArgs>(
      args: SelectSubset<T, AiBotCreateArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AiBots.
     * @param {AiBotCreateManyArgs} args - Arguments to create many AiBots.
     * @example
     * // Create many AiBots
     * const aiBot = await prisma.aiBot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AiBotCreateManyArgs>(
      args?: SelectSubset<T, AiBotCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AiBots and returns the data saved in the database.
     * @param {AiBotCreateManyAndReturnArgs} args - Arguments to create many AiBots.
     * @example
     * // Create many AiBots
     * const aiBot = await prisma.aiBot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AiBots and only return the `id`
     * const aiBotWithIdOnly = await prisma.aiBot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AiBotCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AiBotCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a AiBot.
     * @param {AiBotDeleteArgs} args - Arguments to delete one AiBot.
     * @example
     * // Delete one AiBot
     * const AiBot = await prisma.aiBot.delete({
     *   where: {
     *     // ... filter to delete one AiBot
     *   }
     * })
     *
     */
    delete<T extends AiBotDeleteArgs>(
      args: SelectSubset<T, AiBotDeleteArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AiBot.
     * @param {AiBotUpdateArgs} args - Arguments to update one AiBot.
     * @example
     * // Update one AiBot
     * const aiBot = await prisma.aiBot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AiBotUpdateArgs>(
      args: SelectSubset<T, AiBotUpdateArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AiBots.
     * @param {AiBotDeleteManyArgs} args - Arguments to filter AiBots to delete.
     * @example
     * // Delete a few AiBots
     * const { count } = await prisma.aiBot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AiBotDeleteManyArgs>(
      args?: SelectSubset<T, AiBotDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiBots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiBots
     * const aiBot = await prisma.aiBot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AiBotUpdateManyArgs>(
      args: SelectSubset<T, AiBotUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiBots and returns the data updated in the database.
     * @param {AiBotUpdateManyAndReturnArgs} args - Arguments to update many AiBots.
     * @example
     * // Update many AiBots
     * const aiBot = await prisma.aiBot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AiBots and only return the `id`
     * const aiBotWithIdOnly = await prisma.aiBot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AiBotUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AiBotUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one AiBot.
     * @param {AiBotUpsertArgs} args - Arguments to update or create a AiBot.
     * @example
     * // Update or create a AiBot
     * const aiBot = await prisma.aiBot.upsert({
     *   create: {
     *     // ... data to create a AiBot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiBot we want to update
     *   }
     * })
     */
    upsert<T extends AiBotUpsertArgs>(
      args: SelectSubset<T, AiBotUpsertArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<Prisma.$AiBotPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of AiBots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotCountArgs} args - Arguments to filter AiBots to count.
     * @example
     * // Count the number of AiBots
     * const count = await prisma.aiBot.count({
     *   where: {
     *     // ... the filter for the AiBots we want to count
     *   }
     * })
     **/
    count<T extends AiBotCountArgs>(
      args?: Subset<T, AiBotCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiBotCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AiBot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AiBotAggregateArgs>(
      args: Subset<T, AiBotAggregateArgs>
    ): Prisma.PrismaPromise<GetAiBotAggregateType<T>>;

    /**
     * Group by AiBot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiBotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AiBotGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiBotGroupByArgs['orderBy'] }
        : { orderBy?: AiBotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AiBotGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetAiBotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AiBot model
     */
    readonly fields: AiBotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiBot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiBotClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    aiProvider<T extends AiProviderDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AiProviderDefaultArgs<ExtArgs>>
    ): Prisma__AiProviderClient<
      | $Result.GetResult<
          Prisma.$AiProviderPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    sharedWith<T extends AiBot$sharedWithArgs<ExtArgs> = {}>(
      args?: Subset<T, AiBot$sharedWithArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$UserAiBotAccessPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    aiUsageMetrics<T extends AiBot$aiUsageMetricsArgs<ExtArgs> = {}>(
      args?: Subset<T, AiBot$aiUsageMetricsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AiBot model
   */
  interface AiBotFieldRefs {
    readonly id: FieldRef<'AiBot', 'String'>;
    readonly name: FieldRef<'AiBot', 'String'>;
    readonly systemPrompt: FieldRef<'AiBot', 'String'>;
    readonly isActive: FieldRef<'AiBot', 'Boolean'>;
    readonly createdAt: FieldRef<'AiBot', 'DateTime'>;
    readonly updatedAt: FieldRef<'AiBot', 'DateTime'>;
    readonly ownerId: FieldRef<'AiBot', 'String'>;
    readonly aiProviderId: FieldRef<'AiBot', 'String'>;
  }

  // Custom InputTypes
  /**
   * AiBot findUnique
   */
  export type AiBotFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    /**
     * Filter, which AiBot to fetch.
     */
    where: AiBotWhereUniqueInput;
  };

  /**
   * AiBot findUniqueOrThrow
   */
  export type AiBotFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    /**
     * Filter, which AiBot to fetch.
     */
    where: AiBotWhereUniqueInput;
  };

  /**
   * AiBot findFirst
   */
  export type AiBotFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    /**
     * Filter, which AiBot to fetch.
     */
    where?: AiBotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiBots to fetch.
     */
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiBots.
     */
    cursor?: AiBotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiBots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiBots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiBots.
     */
    distinct?: AiBotScalarFieldEnum | AiBotScalarFieldEnum[];
  };

  /**
   * AiBot findFirstOrThrow
   */
  export type AiBotFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    /**
     * Filter, which AiBot to fetch.
     */
    where?: AiBotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiBots to fetch.
     */
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiBots.
     */
    cursor?: AiBotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiBots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiBots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiBots.
     */
    distinct?: AiBotScalarFieldEnum | AiBotScalarFieldEnum[];
  };

  /**
   * AiBot findMany
   */
  export type AiBotFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    /**
     * Filter, which AiBots to fetch.
     */
    where?: AiBotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiBots to fetch.
     */
    orderBy?: AiBotOrderByWithRelationInput | AiBotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AiBots.
     */
    cursor?: AiBotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiBots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiBots.
     */
    skip?: number;
    distinct?: AiBotScalarFieldEnum | AiBotScalarFieldEnum[];
  };

  /**
   * AiBot create
   */
  export type AiBotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AiBot
       */
      select?: AiBotSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the AiBot
       */
      omit?: AiBotOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AiBotInclude<ExtArgs> | null;
      /**
       * The data needed to create a AiBot.
       */
      data: XOR<AiBotCreateInput, AiBotUncheckedCreateInput>;
    };

  /**
   * AiBot createMany
   */
  export type AiBotCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AiBots.
     */
    data: AiBotCreateManyInput | AiBotCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AiBot createManyAndReturn
   */
  export type AiBotCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * The data used to create many AiBots.
     */
    data: AiBotCreateManyInput | AiBotCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiBot update
   */
  export type AiBotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AiBot
       */
      select?: AiBotSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the AiBot
       */
      omit?: AiBotOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AiBotInclude<ExtArgs> | null;
      /**
       * The data needed to update a AiBot.
       */
      data: XOR<AiBotUpdateInput, AiBotUncheckedUpdateInput>;
      /**
       * Choose, which AiBot to update.
       */
      where: AiBotWhereUniqueInput;
    };

  /**
   * AiBot updateMany
   */
  export type AiBotUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AiBots.
     */
    data: XOR<AiBotUpdateManyMutationInput, AiBotUncheckedUpdateManyInput>;
    /**
     * Filter which AiBots to update
     */
    where?: AiBotWhereInput;
    /**
     * Limit how many AiBots to update.
     */
    limit?: number;
  };

  /**
   * AiBot updateManyAndReturn
   */
  export type AiBotUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * The data used to update AiBots.
     */
    data: XOR<AiBotUpdateManyMutationInput, AiBotUncheckedUpdateManyInput>;
    /**
     * Filter which AiBots to update
     */
    where?: AiBotWhereInput;
    /**
     * Limit how many AiBots to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiBot upsert
   */
  export type AiBotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AiBot
       */
      select?: AiBotSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the AiBot
       */
      omit?: AiBotOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AiBotInclude<ExtArgs> | null;
      /**
       * The filter to search for the AiBot to update in case it exists.
       */
      where: AiBotWhereUniqueInput;
      /**
       * In case the AiBot found by the `where` argument doesn't exist, create a new AiBot with this data.
       */
      create: XOR<AiBotCreateInput, AiBotUncheckedCreateInput>;
      /**
       * In case the AiBot was found with the provided `where` argument, update it with this data.
       */
      update: XOR<AiBotUpdateInput, AiBotUncheckedUpdateInput>;
    };

  /**
   * AiBot delete
   */
  export type AiBotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AiBot
       */
      select?: AiBotSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the AiBot
       */
      omit?: AiBotOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AiBotInclude<ExtArgs> | null;
      /**
       * Filter which AiBot to delete.
       */
      where: AiBotWhereUniqueInput;
    };

  /**
   * AiBot deleteMany
   */
  export type AiBotDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiBots to delete
     */
    where?: AiBotWhereInput;
    /**
     * Limit how many AiBots to delete.
     */
    limit?: number;
  };

  /**
   * AiBot.sharedWith
   */
  export type AiBot$sharedWithArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserAiBotAccess
     */
    select?: UserAiBotAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserAiBotAccess
     */
    omit?: UserAiBotAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAiBotAccessInclude<ExtArgs> | null;
    where?: UserAiBotAccessWhereInput;
    orderBy?: UserAiBotAccessOrderByWithRelationInput | UserAiBotAccessOrderByWithRelationInput[];
    cursor?: UserAiBotAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserAiBotAccessScalarFieldEnum | UserAiBotAccessScalarFieldEnum[];
  };

  /**
   * AiBot.aiUsageMetrics
   */
  export type AiBot$aiUsageMetricsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    where?: AiUsageMetricWhereInput;
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    cursor?: AiUsageMetricWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[];
  };

  /**
   * AiBot without action
   */
  export type AiBotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AiBot
       */
      select?: AiBotSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the AiBot
       */
      omit?: AiBotOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AiBotInclude<ExtArgs> | null;
    };

  /**
   * Model ProcessedDocument
   */

  export type AggregateProcessedDocument = {
    _count: ProcessedDocumentCountAggregateOutputType | null;
    _avg: ProcessedDocumentAvgAggregateOutputType | null;
    _sum: ProcessedDocumentSumAggregateOutputType | null;
    _min: ProcessedDocumentMinAggregateOutputType | null;
    _max: ProcessedDocumentMaxAggregateOutputType | null;
  };

  export type ProcessedDocumentAvgAggregateOutputType = {
    paperlessId: number | null;
    tokensUsed: number | null;
  };

  export type ProcessedDocumentSumAggregateOutputType = {
    paperlessId: number | null;
    tokensUsed: number | null;
  };

  export type ProcessedDocumentMinAggregateOutputType = {
    id: string | null;
    paperlessId: number | null;
    title: string | null;
    processedAt: Date | null;
    aiProvider: string | null;
    tokensUsed: number | null;
    originalTitle: string | null;
    originalCorrespondent: string | null;
    originalDocumentType: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paperlessInstanceId: string | null;
  };

  export type ProcessedDocumentMaxAggregateOutputType = {
    id: string | null;
    paperlessId: number | null;
    title: string | null;
    processedAt: Date | null;
    aiProvider: string | null;
    tokensUsed: number | null;
    originalTitle: string | null;
    originalCorrespondent: string | null;
    originalDocumentType: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paperlessInstanceId: string | null;
  };

  export type ProcessedDocumentCountAggregateOutputType = {
    id: number;
    paperlessId: number;
    title: number;
    processedAt: number;
    aiProvider: number;
    tokensUsed: number;
    changes: number;
    originalTitle: number;
    originalCorrespondent: number;
    originalDocumentType: number;
    originalTags: number;
    createdAt: number;
    updatedAt: number;
    paperlessInstanceId: number;
    _all: number;
  };

  export type ProcessedDocumentAvgAggregateInputType = {
    paperlessId?: true;
    tokensUsed?: true;
  };

  export type ProcessedDocumentSumAggregateInputType = {
    paperlessId?: true;
    tokensUsed?: true;
  };

  export type ProcessedDocumentMinAggregateInputType = {
    id?: true;
    paperlessId?: true;
    title?: true;
    processedAt?: true;
    aiProvider?: true;
    tokensUsed?: true;
    originalTitle?: true;
    originalCorrespondent?: true;
    originalDocumentType?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
  };

  export type ProcessedDocumentMaxAggregateInputType = {
    id?: true;
    paperlessId?: true;
    title?: true;
    processedAt?: true;
    aiProvider?: true;
    tokensUsed?: true;
    originalTitle?: true;
    originalCorrespondent?: true;
    originalDocumentType?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
  };

  export type ProcessedDocumentCountAggregateInputType = {
    id?: true;
    paperlessId?: true;
    title?: true;
    processedAt?: true;
    aiProvider?: true;
    tokensUsed?: true;
    changes?: true;
    originalTitle?: true;
    originalCorrespondent?: true;
    originalDocumentType?: true;
    originalTags?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
    _all?: true;
  };

  export type ProcessedDocumentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProcessedDocument to aggregate.
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedDocuments to fetch.
     */
    orderBy?:
      | ProcessedDocumentOrderByWithRelationInput
      | ProcessedDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProcessedDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProcessedDocuments
     **/
    _count?: true | ProcessedDocumentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProcessedDocumentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProcessedDocumentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProcessedDocumentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProcessedDocumentMaxAggregateInputType;
  };

  export type GetProcessedDocumentAggregateType<T extends ProcessedDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateProcessedDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessedDocument[P]>
      : GetScalarType<T[P], AggregateProcessedDocument[P]>;
  };

  export type ProcessedDocumentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProcessedDocumentWhereInput;
    orderBy?:
      | ProcessedDocumentOrderByWithAggregationInput
      | ProcessedDocumentOrderByWithAggregationInput[];
    by: ProcessedDocumentScalarFieldEnum[] | ProcessedDocumentScalarFieldEnum;
    having?: ProcessedDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProcessedDocumentCountAggregateInputType | true;
    _avg?: ProcessedDocumentAvgAggregateInputType;
    _sum?: ProcessedDocumentSumAggregateInputType;
    _min?: ProcessedDocumentMinAggregateInputType;
    _max?: ProcessedDocumentMaxAggregateInputType;
  };

  export type ProcessedDocumentGroupByOutputType = {
    id: string;
    paperlessId: number;
    title: string;
    processedAt: Date;
    aiProvider: string;
    tokensUsed: number;
    changes: JsonValue | null;
    originalTitle: string | null;
    originalCorrespondent: string | null;
    originalDocumentType: string | null;
    originalTags: string[];
    createdAt: Date;
    updatedAt: Date;
    paperlessInstanceId: string;
    _count: ProcessedDocumentCountAggregateOutputType | null;
    _avg: ProcessedDocumentAvgAggregateOutputType | null;
    _sum: ProcessedDocumentSumAggregateOutputType | null;
    _min: ProcessedDocumentMinAggregateOutputType | null;
    _max: ProcessedDocumentMaxAggregateOutputType | null;
  };

  type GetProcessedDocumentGroupByPayload<T extends ProcessedDocumentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProcessedDocumentGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProcessedDocumentGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessedDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessedDocumentGroupByOutputType[P]>;
        }
      >
    >;

  export type ProcessedDocumentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      title?: boolean;
      processedAt?: boolean;
      aiProvider?: boolean;
      tokensUsed?: boolean;
      changes?: boolean;
      originalTitle?: boolean;
      originalCorrespondent?: boolean;
      originalDocumentType?: boolean;
      originalTags?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processedDocument']
  >;

  export type ProcessedDocumentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      title?: boolean;
      processedAt?: boolean;
      aiProvider?: boolean;
      tokensUsed?: boolean;
      changes?: boolean;
      originalTitle?: boolean;
      originalCorrespondent?: boolean;
      originalDocumentType?: boolean;
      originalTags?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processedDocument']
  >;

  export type ProcessedDocumentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      title?: boolean;
      processedAt?: boolean;
      aiProvider?: boolean;
      tokensUsed?: boolean;
      changes?: boolean;
      originalTitle?: boolean;
      originalCorrespondent?: boolean;
      originalDocumentType?: boolean;
      originalTags?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processedDocument']
  >;

  export type ProcessedDocumentSelectScalar = {
    id?: boolean;
    paperlessId?: boolean;
    title?: boolean;
    processedAt?: boolean;
    aiProvider?: boolean;
    tokensUsed?: boolean;
    changes?: boolean;
    originalTitle?: boolean;
    originalCorrespondent?: boolean;
    originalDocumentType?: boolean;
    originalTags?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paperlessInstanceId?: boolean;
  };

  export type ProcessedDocumentOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'paperlessId'
    | 'title'
    | 'processedAt'
    | 'aiProvider'
    | 'tokensUsed'
    | 'changes'
    | 'originalTitle'
    | 'originalCorrespondent'
    | 'originalDocumentType'
    | 'originalTags'
    | 'createdAt'
    | 'updatedAt'
    | 'paperlessInstanceId',
    ExtArgs['result']['processedDocument']
  >;
  export type ProcessedDocumentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type ProcessedDocumentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type ProcessedDocumentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };

  export type $ProcessedDocumentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProcessedDocument';
    objects: {
      paperlessInstance: Prisma.$PaperlessInstancePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        paperlessId: number;
        title: string;
        processedAt: Date;
        aiProvider: string;
        tokensUsed: number;
        changes: Prisma.JsonValue | null;
        originalTitle: string | null;
        originalCorrespondent: string | null;
        originalDocumentType: string | null;
        originalTags: string[];
        createdAt: Date;
        updatedAt: Date;
        paperlessInstanceId: string;
      },
      ExtArgs['result']['processedDocument']
    >;
    composites: {};
  };

  type ProcessedDocumentGetPayload<
    S extends boolean | null | undefined | ProcessedDocumentDefaultArgs,
  > = $Result.GetResult<Prisma.$ProcessedDocumentPayload, S>;

  type ProcessedDocumentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProcessedDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProcessedDocumentCountAggregateInputType | true;
  };

  export interface ProcessedDocumentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProcessedDocument'];
      meta: { name: 'ProcessedDocument' };
    };
    /**
     * Find zero or one ProcessedDocument that matches the filter.
     * @param {ProcessedDocumentFindUniqueArgs} args - Arguments to find a ProcessedDocument
     * @example
     * // Get one ProcessedDocument
     * const processedDocument = await prisma.processedDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessedDocumentFindUniqueArgs>(
      args: SelectSubset<T, ProcessedDocumentFindUniqueArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one ProcessedDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessedDocumentFindUniqueOrThrowArgs} args - Arguments to find a ProcessedDocument
     * @example
     * // Get one ProcessedDocument
     * const processedDocument = await prisma.processedDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessedDocumentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProcessedDocumentFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ProcessedDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentFindFirstArgs} args - Arguments to find a ProcessedDocument
     * @example
     * // Get one ProcessedDocument
     * const processedDocument = await prisma.processedDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessedDocumentFindFirstArgs>(
      args?: SelectSubset<T, ProcessedDocumentFindFirstArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ProcessedDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentFindFirstOrThrowArgs} args - Arguments to find a ProcessedDocument
     * @example
     * // Get one ProcessedDocument
     * const processedDocument = await prisma.processedDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessedDocumentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProcessedDocumentFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ProcessedDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessedDocuments
     * const processedDocuments = await prisma.processedDocument.findMany()
     *
     * // Get first 10 ProcessedDocuments
     * const processedDocuments = await prisma.processedDocument.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const processedDocumentWithIdOnly = await prisma.processedDocument.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProcessedDocumentFindManyArgs>(
      args?: SelectSubset<T, ProcessedDocumentFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProcessedDocumentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a ProcessedDocument.
     * @param {ProcessedDocumentCreateArgs} args - Arguments to create a ProcessedDocument.
     * @example
     * // Create one ProcessedDocument
     * const ProcessedDocument = await prisma.processedDocument.create({
     *   data: {
     *     // ... data to create a ProcessedDocument
     *   }
     * })
     *
     */
    create<T extends ProcessedDocumentCreateArgs>(
      args: SelectSubset<T, ProcessedDocumentCreateArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<Prisma.$ProcessedDocumentPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many ProcessedDocuments.
     * @param {ProcessedDocumentCreateManyArgs} args - Arguments to create many ProcessedDocuments.
     * @example
     * // Create many ProcessedDocuments
     * const processedDocument = await prisma.processedDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProcessedDocumentCreateManyArgs>(
      args?: SelectSubset<T, ProcessedDocumentCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ProcessedDocuments and returns the data saved in the database.
     * @param {ProcessedDocumentCreateManyAndReturnArgs} args - Arguments to create many ProcessedDocuments.
     * @example
     * // Create many ProcessedDocuments
     * const processedDocument = await prisma.processedDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProcessedDocuments and only return the `id`
     * const processedDocumentWithIdOnly = await prisma.processedDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProcessedDocumentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProcessedDocumentCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a ProcessedDocument.
     * @param {ProcessedDocumentDeleteArgs} args - Arguments to delete one ProcessedDocument.
     * @example
     * // Delete one ProcessedDocument
     * const ProcessedDocument = await prisma.processedDocument.delete({
     *   where: {
     *     // ... filter to delete one ProcessedDocument
     *   }
     * })
     *
     */
    delete<T extends ProcessedDocumentDeleteArgs>(
      args: SelectSubset<T, ProcessedDocumentDeleteArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<Prisma.$ProcessedDocumentPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one ProcessedDocument.
     * @param {ProcessedDocumentUpdateArgs} args - Arguments to update one ProcessedDocument.
     * @example
     * // Update one ProcessedDocument
     * const processedDocument = await prisma.processedDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProcessedDocumentUpdateArgs>(
      args: SelectSubset<T, ProcessedDocumentUpdateArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<Prisma.$ProcessedDocumentPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more ProcessedDocuments.
     * @param {ProcessedDocumentDeleteManyArgs} args - Arguments to filter ProcessedDocuments to delete.
     * @example
     * // Delete a few ProcessedDocuments
     * const { count } = await prisma.processedDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProcessedDocumentDeleteManyArgs>(
      args?: SelectSubset<T, ProcessedDocumentDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProcessedDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessedDocuments
     * const processedDocument = await prisma.processedDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProcessedDocumentUpdateManyArgs>(
      args: SelectSubset<T, ProcessedDocumentUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProcessedDocuments and returns the data updated in the database.
     * @param {ProcessedDocumentUpdateManyAndReturnArgs} args - Arguments to update many ProcessedDocuments.
     * @example
     * // Update many ProcessedDocuments
     * const processedDocument = await prisma.processedDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProcessedDocuments and only return the `id`
     * const processedDocumentWithIdOnly = await prisma.processedDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProcessedDocumentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProcessedDocumentUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProcessedDocumentPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one ProcessedDocument.
     * @param {ProcessedDocumentUpsertArgs} args - Arguments to update or create a ProcessedDocument.
     * @example
     * // Update or create a ProcessedDocument
     * const processedDocument = await prisma.processedDocument.upsert({
     *   create: {
     *     // ... data to create a ProcessedDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessedDocument we want to update
     *   }
     * })
     */
    upsert<T extends ProcessedDocumentUpsertArgs>(
      args: SelectSubset<T, ProcessedDocumentUpsertArgs<ExtArgs>>
    ): Prisma__ProcessedDocumentClient<
      $Result.GetResult<Prisma.$ProcessedDocumentPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of ProcessedDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentCountArgs} args - Arguments to filter ProcessedDocuments to count.
     * @example
     * // Count the number of ProcessedDocuments
     * const count = await prisma.processedDocument.count({
     *   where: {
     *     // ... the filter for the ProcessedDocuments we want to count
     *   }
     * })
     **/
    count<T extends ProcessedDocumentCountArgs>(
      args?: Subset<T, ProcessedDocumentCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessedDocumentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProcessedDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProcessedDocumentAggregateArgs>(
      args: Subset<T, ProcessedDocumentAggregateArgs>
    ): Prisma.PrismaPromise<GetProcessedDocumentAggregateType<T>>;

    /**
     * Group by ProcessedDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProcessedDocumentGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessedDocumentGroupByArgs['orderBy'] }
        : { orderBy?: ProcessedDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProcessedDocumentGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProcessedDocumentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProcessedDocument model
     */
    readonly fields: ProcessedDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessedDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessedDocumentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    paperlessInstance<T extends PaperlessInstanceDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstanceDefaultArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      | $Result.GetResult<
          Prisma.$PaperlessInstancePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ProcessedDocument model
   */
  interface ProcessedDocumentFieldRefs {
    readonly id: FieldRef<'ProcessedDocument', 'String'>;
    readonly paperlessId: FieldRef<'ProcessedDocument', 'Int'>;
    readonly title: FieldRef<'ProcessedDocument', 'String'>;
    readonly processedAt: FieldRef<'ProcessedDocument', 'DateTime'>;
    readonly aiProvider: FieldRef<'ProcessedDocument', 'String'>;
    readonly tokensUsed: FieldRef<'ProcessedDocument', 'Int'>;
    readonly changes: FieldRef<'ProcessedDocument', 'Json'>;
    readonly originalTitle: FieldRef<'ProcessedDocument', 'String'>;
    readonly originalCorrespondent: FieldRef<'ProcessedDocument', 'String'>;
    readonly originalDocumentType: FieldRef<'ProcessedDocument', 'String'>;
    readonly originalTags: FieldRef<'ProcessedDocument', 'String[]'>;
    readonly createdAt: FieldRef<'ProcessedDocument', 'DateTime'>;
    readonly updatedAt: FieldRef<'ProcessedDocument', 'DateTime'>;
    readonly paperlessInstanceId: FieldRef<'ProcessedDocument', 'String'>;
  }

  // Custom InputTypes
  /**
   * ProcessedDocument findUnique
   */
  export type ProcessedDocumentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessedDocument to fetch.
     */
    where: ProcessedDocumentWhereUniqueInput;
  };

  /**
   * ProcessedDocument findUniqueOrThrow
   */
  export type ProcessedDocumentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessedDocument to fetch.
     */
    where: ProcessedDocumentWhereUniqueInput;
  };

  /**
   * ProcessedDocument findFirst
   */
  export type ProcessedDocumentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessedDocument to fetch.
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedDocuments to fetch.
     */
    orderBy?:
      | ProcessedDocumentOrderByWithRelationInput
      | ProcessedDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessedDocuments.
     */
    cursor?: ProcessedDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessedDocuments.
     */
    distinct?: ProcessedDocumentScalarFieldEnum | ProcessedDocumentScalarFieldEnum[];
  };

  /**
   * ProcessedDocument findFirstOrThrow
   */
  export type ProcessedDocumentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessedDocument to fetch.
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedDocuments to fetch.
     */
    orderBy?:
      | ProcessedDocumentOrderByWithRelationInput
      | ProcessedDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessedDocuments.
     */
    cursor?: ProcessedDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessedDocuments.
     */
    distinct?: ProcessedDocumentScalarFieldEnum | ProcessedDocumentScalarFieldEnum[];
  };

  /**
   * ProcessedDocument findMany
   */
  export type ProcessedDocumentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessedDocuments to fetch.
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessedDocuments to fetch.
     */
    orderBy?:
      | ProcessedDocumentOrderByWithRelationInput
      | ProcessedDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProcessedDocuments.
     */
    cursor?: ProcessedDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessedDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessedDocuments.
     */
    skip?: number;
    distinct?: ProcessedDocumentScalarFieldEnum | ProcessedDocumentScalarFieldEnum[];
  };

  /**
   * ProcessedDocument create
   */
  export type ProcessedDocumentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProcessedDocument.
     */
    data: XOR<ProcessedDocumentCreateInput, ProcessedDocumentUncheckedCreateInput>;
  };

  /**
   * ProcessedDocument createMany
   */
  export type ProcessedDocumentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProcessedDocuments.
     */
    data: ProcessedDocumentCreateManyInput | ProcessedDocumentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ProcessedDocument createManyAndReturn
   */
  export type ProcessedDocumentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * The data used to create many ProcessedDocuments.
     */
    data: ProcessedDocumentCreateManyInput | ProcessedDocumentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProcessedDocument update
   */
  export type ProcessedDocumentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProcessedDocument.
     */
    data: XOR<ProcessedDocumentUpdateInput, ProcessedDocumentUncheckedUpdateInput>;
    /**
     * Choose, which ProcessedDocument to update.
     */
    where: ProcessedDocumentWhereUniqueInput;
  };

  /**
   * ProcessedDocument updateMany
   */
  export type ProcessedDocumentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProcessedDocuments.
     */
    data: XOR<ProcessedDocumentUpdateManyMutationInput, ProcessedDocumentUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessedDocuments to update
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * Limit how many ProcessedDocuments to update.
     */
    limit?: number;
  };

  /**
   * ProcessedDocument updateManyAndReturn
   */
  export type ProcessedDocumentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * The data used to update ProcessedDocuments.
     */
    data: XOR<ProcessedDocumentUpdateManyMutationInput, ProcessedDocumentUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessedDocuments to update
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * Limit how many ProcessedDocuments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProcessedDocument upsert
   */
  export type ProcessedDocumentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProcessedDocument to update in case it exists.
     */
    where: ProcessedDocumentWhereUniqueInput;
    /**
     * In case the ProcessedDocument found by the `where` argument doesn't exist, create a new ProcessedDocument with this data.
     */
    create: XOR<ProcessedDocumentCreateInput, ProcessedDocumentUncheckedCreateInput>;
    /**
     * In case the ProcessedDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessedDocumentUpdateInput, ProcessedDocumentUncheckedUpdateInput>;
  };

  /**
   * ProcessedDocument delete
   */
  export type ProcessedDocumentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
    /**
     * Filter which ProcessedDocument to delete.
     */
    where: ProcessedDocumentWhereUniqueInput;
  };

  /**
   * ProcessedDocument deleteMany
   */
  export type ProcessedDocumentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProcessedDocuments to delete
     */
    where?: ProcessedDocumentWhereInput;
    /**
     * Limit how many ProcessedDocuments to delete.
     */
    limit?: number;
  };

  /**
   * ProcessedDocument without action
   */
  export type ProcessedDocumentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessedDocument
     */
    select?: ProcessedDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessedDocument
     */
    omit?: ProcessedDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessedDocumentInclude<ExtArgs> | null;
  };

  /**
   * Model ProcessingQueue
   */

  export type AggregateProcessingQueue = {
    _count: ProcessingQueueCountAggregateOutputType | null;
    _avg: ProcessingQueueAvgAggregateOutputType | null;
    _sum: ProcessingQueueSumAggregateOutputType | null;
    _min: ProcessingQueueMinAggregateOutputType | null;
    _max: ProcessingQueueMaxAggregateOutputType | null;
  };

  export type ProcessingQueueAvgAggregateOutputType = {
    paperlessId: number | null;
    priority: number | null;
    attempts: number | null;
  };

  export type ProcessingQueueSumAggregateOutputType = {
    paperlessId: number | null;
    priority: number | null;
    attempts: number | null;
  };

  export type ProcessingQueueMinAggregateOutputType = {
    id: string | null;
    paperlessId: number | null;
    status: string | null;
    priority: number | null;
    attempts: number | null;
    lastError: string | null;
    scheduledFor: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paperlessInstanceId: string | null;
  };

  export type ProcessingQueueMaxAggregateOutputType = {
    id: string | null;
    paperlessId: number | null;
    status: string | null;
    priority: number | null;
    attempts: number | null;
    lastError: string | null;
    scheduledFor: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    paperlessInstanceId: string | null;
  };

  export type ProcessingQueueCountAggregateOutputType = {
    id: number;
    paperlessId: number;
    status: number;
    priority: number;
    attempts: number;
    lastError: number;
    scheduledFor: number;
    startedAt: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    paperlessInstanceId: number;
    _all: number;
  };

  export type ProcessingQueueAvgAggregateInputType = {
    paperlessId?: true;
    priority?: true;
    attempts?: true;
  };

  export type ProcessingQueueSumAggregateInputType = {
    paperlessId?: true;
    priority?: true;
    attempts?: true;
  };

  export type ProcessingQueueMinAggregateInputType = {
    id?: true;
    paperlessId?: true;
    status?: true;
    priority?: true;
    attempts?: true;
    lastError?: true;
    scheduledFor?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
  };

  export type ProcessingQueueMaxAggregateInputType = {
    id?: true;
    paperlessId?: true;
    status?: true;
    priority?: true;
    attempts?: true;
    lastError?: true;
    scheduledFor?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
  };

  export type ProcessingQueueCountAggregateInputType = {
    id?: true;
    paperlessId?: true;
    status?: true;
    priority?: true;
    attempts?: true;
    lastError?: true;
    scheduledFor?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    paperlessInstanceId?: true;
    _all?: true;
  };

  export type ProcessingQueueAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProcessingQueue to aggregate.
     */
    where?: ProcessingQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessingQueues to fetch.
     */
    orderBy?: ProcessingQueueOrderByWithRelationInput | ProcessingQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProcessingQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessingQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessingQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProcessingQueues
     **/
    _count?: true | ProcessingQueueCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProcessingQueueAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProcessingQueueSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProcessingQueueMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProcessingQueueMaxAggregateInputType;
  };

  export type GetProcessingQueueAggregateType<T extends ProcessingQueueAggregateArgs> = {
    [P in keyof T & keyof AggregateProcessingQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessingQueue[P]>
      : GetScalarType<T[P], AggregateProcessingQueue[P]>;
  };

  export type ProcessingQueueGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProcessingQueueWhereInput;
    orderBy?:
      | ProcessingQueueOrderByWithAggregationInput
      | ProcessingQueueOrderByWithAggregationInput[];
    by: ProcessingQueueScalarFieldEnum[] | ProcessingQueueScalarFieldEnum;
    having?: ProcessingQueueScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProcessingQueueCountAggregateInputType | true;
    _avg?: ProcessingQueueAvgAggregateInputType;
    _sum?: ProcessingQueueSumAggregateInputType;
    _min?: ProcessingQueueMinAggregateInputType;
    _max?: ProcessingQueueMaxAggregateInputType;
  };

  export type ProcessingQueueGroupByOutputType = {
    id: string;
    paperlessId: number;
    status: string;
    priority: number;
    attempts: number;
    lastError: string | null;
    scheduledFor: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    paperlessInstanceId: string;
    _count: ProcessingQueueCountAggregateOutputType | null;
    _avg: ProcessingQueueAvgAggregateOutputType | null;
    _sum: ProcessingQueueSumAggregateOutputType | null;
    _min: ProcessingQueueMinAggregateOutputType | null;
    _max: ProcessingQueueMaxAggregateOutputType | null;
  };

  type GetProcessingQueueGroupByPayload<T extends ProcessingQueueGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProcessingQueueGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProcessingQueueGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessingQueueGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessingQueueGroupByOutputType[P]>;
        }
      >
    >;

  export type ProcessingQueueSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      status?: boolean;
      priority?: boolean;
      attempts?: boolean;
      lastError?: boolean;
      scheduledFor?: boolean;
      startedAt?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processingQueue']
  >;

  export type ProcessingQueueSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      status?: boolean;
      priority?: boolean;
      attempts?: boolean;
      lastError?: boolean;
      scheduledFor?: boolean;
      startedAt?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processingQueue']
  >;

  export type ProcessingQueueSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      paperlessId?: boolean;
      status?: boolean;
      priority?: boolean;
      attempts?: boolean;
      lastError?: boolean;
      scheduledFor?: boolean;
      startedAt?: boolean;
      completedAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      paperlessInstanceId?: boolean;
      paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['processingQueue']
  >;

  export type ProcessingQueueSelectScalar = {
    id?: boolean;
    paperlessId?: boolean;
    status?: boolean;
    priority?: boolean;
    attempts?: boolean;
    lastError?: boolean;
    scheduledFor?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    paperlessInstanceId?: boolean;
  };

  export type ProcessingQueueOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'paperlessId'
    | 'status'
    | 'priority'
    | 'attempts'
    | 'lastError'
    | 'scheduledFor'
    | 'startedAt'
    | 'completedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'paperlessInstanceId',
    ExtArgs['result']['processingQueue']
  >;
  export type ProcessingQueueInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type ProcessingQueueIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };
  export type ProcessingQueueIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    paperlessInstance?: boolean | PaperlessInstanceDefaultArgs<ExtArgs>;
  };

  export type $ProcessingQueuePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProcessingQueue';
    objects: {
      paperlessInstance: Prisma.$PaperlessInstancePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        paperlessId: number;
        status: string;
        priority: number;
        attempts: number;
        lastError: string | null;
        scheduledFor: Date;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        paperlessInstanceId: string;
      },
      ExtArgs['result']['processingQueue']
    >;
    composites: {};
  };

  type ProcessingQueueGetPayload<
    S extends boolean | null | undefined | ProcessingQueueDefaultArgs,
  > = $Result.GetResult<Prisma.$ProcessingQueuePayload, S>;

  type ProcessingQueueCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProcessingQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProcessingQueueCountAggregateInputType | true;
  };

  export interface ProcessingQueueDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProcessingQueue'];
      meta: { name: 'ProcessingQueue' };
    };
    /**
     * Find zero or one ProcessingQueue that matches the filter.
     * @param {ProcessingQueueFindUniqueArgs} args - Arguments to find a ProcessingQueue
     * @example
     * // Get one ProcessingQueue
     * const processingQueue = await prisma.processingQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessingQueueFindUniqueArgs>(
      args: SelectSubset<T, ProcessingQueueFindUniqueArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one ProcessingQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessingQueueFindUniqueOrThrowArgs} args - Arguments to find a ProcessingQueue
     * @example
     * // Get one ProcessingQueue
     * const processingQueue = await prisma.processingQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessingQueueFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProcessingQueueFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ProcessingQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueFindFirstArgs} args - Arguments to find a ProcessingQueue
     * @example
     * // Get one ProcessingQueue
     * const processingQueue = await prisma.processingQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessingQueueFindFirstArgs>(
      args?: SelectSubset<T, ProcessingQueueFindFirstArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first ProcessingQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueFindFirstOrThrowArgs} args - Arguments to find a ProcessingQueue
     * @example
     * // Get one ProcessingQueue
     * const processingQueue = await prisma.processingQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessingQueueFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProcessingQueueFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more ProcessingQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessingQueues
     * const processingQueues = await prisma.processingQueue.findMany()
     *
     * // Get first 10 ProcessingQueues
     * const processingQueues = await prisma.processingQueue.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const processingQueueWithIdOnly = await prisma.processingQueue.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProcessingQueueFindManyArgs>(
      args?: SelectSubset<T, ProcessingQueueFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a ProcessingQueue.
     * @param {ProcessingQueueCreateArgs} args - Arguments to create a ProcessingQueue.
     * @example
     * // Create one ProcessingQueue
     * const ProcessingQueue = await prisma.processingQueue.create({
     *   data: {
     *     // ... data to create a ProcessingQueue
     *   }
     * })
     *
     */
    create<T extends ProcessingQueueCreateArgs>(
      args: SelectSubset<T, ProcessingQueueCreateArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many ProcessingQueues.
     * @param {ProcessingQueueCreateManyArgs} args - Arguments to create many ProcessingQueues.
     * @example
     * // Create many ProcessingQueues
     * const processingQueue = await prisma.processingQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProcessingQueueCreateManyArgs>(
      args?: SelectSubset<T, ProcessingQueueCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ProcessingQueues and returns the data saved in the database.
     * @param {ProcessingQueueCreateManyAndReturnArgs} args - Arguments to create many ProcessingQueues.
     * @example
     * // Create many ProcessingQueues
     * const processingQueue = await prisma.processingQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProcessingQueues and only return the `id`
     * const processingQueueWithIdOnly = await prisma.processingQueue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProcessingQueueCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProcessingQueueCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a ProcessingQueue.
     * @param {ProcessingQueueDeleteArgs} args - Arguments to delete one ProcessingQueue.
     * @example
     * // Delete one ProcessingQueue
     * const ProcessingQueue = await prisma.processingQueue.delete({
     *   where: {
     *     // ... filter to delete one ProcessingQueue
     *   }
     * })
     *
     */
    delete<T extends ProcessingQueueDeleteArgs>(
      args: SelectSubset<T, ProcessingQueueDeleteArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one ProcessingQueue.
     * @param {ProcessingQueueUpdateArgs} args - Arguments to update one ProcessingQueue.
     * @example
     * // Update one ProcessingQueue
     * const processingQueue = await prisma.processingQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProcessingQueueUpdateArgs>(
      args: SelectSubset<T, ProcessingQueueUpdateArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more ProcessingQueues.
     * @param {ProcessingQueueDeleteManyArgs} args - Arguments to filter ProcessingQueues to delete.
     * @example
     * // Delete a few ProcessingQueues
     * const { count } = await prisma.processingQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProcessingQueueDeleteManyArgs>(
      args?: SelectSubset<T, ProcessingQueueDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProcessingQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessingQueues
     * const processingQueue = await prisma.processingQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProcessingQueueUpdateManyArgs>(
      args: SelectSubset<T, ProcessingQueueUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProcessingQueues and returns the data updated in the database.
     * @param {ProcessingQueueUpdateManyAndReturnArgs} args - Arguments to update many ProcessingQueues.
     * @example
     * // Update many ProcessingQueues
     * const processingQueue = await prisma.processingQueue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProcessingQueues and only return the `id`
     * const processingQueueWithIdOnly = await prisma.processingQueue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProcessingQueueUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProcessingQueueUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProcessingQueuePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one ProcessingQueue.
     * @param {ProcessingQueueUpsertArgs} args - Arguments to update or create a ProcessingQueue.
     * @example
     * // Update or create a ProcessingQueue
     * const processingQueue = await prisma.processingQueue.upsert({
     *   create: {
     *     // ... data to create a ProcessingQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessingQueue we want to update
     *   }
     * })
     */
    upsert<T extends ProcessingQueueUpsertArgs>(
      args: SelectSubset<T, ProcessingQueueUpsertArgs<ExtArgs>>
    ): Prisma__ProcessingQueueClient<
      $Result.GetResult<Prisma.$ProcessingQueuePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of ProcessingQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueCountArgs} args - Arguments to filter ProcessingQueues to count.
     * @example
     * // Count the number of ProcessingQueues
     * const count = await prisma.processingQueue.count({
     *   where: {
     *     // ... the filter for the ProcessingQueues we want to count
     *   }
     * })
     **/
    count<T extends ProcessingQueueCountArgs>(
      args?: Subset<T, ProcessingQueueCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessingQueueCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProcessingQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProcessingQueueAggregateArgs>(
      args: Subset<T, ProcessingQueueAggregateArgs>
    ): Prisma.PrismaPromise<GetProcessingQueueAggregateType<T>>;

    /**
     * Group by ProcessingQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProcessingQueueGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessingQueueGroupByArgs['orderBy'] }
        : { orderBy?: ProcessingQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProcessingQueueGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProcessingQueueGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProcessingQueue model
     */
    readonly fields: ProcessingQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessingQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessingQueueClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    paperlessInstance<T extends PaperlessInstanceDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PaperlessInstanceDefaultArgs<ExtArgs>>
    ): Prisma__PaperlessInstanceClient<
      | $Result.GetResult<
          Prisma.$PaperlessInstancePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ProcessingQueue model
   */
  interface ProcessingQueueFieldRefs {
    readonly id: FieldRef<'ProcessingQueue', 'String'>;
    readonly paperlessId: FieldRef<'ProcessingQueue', 'Int'>;
    readonly status: FieldRef<'ProcessingQueue', 'String'>;
    readonly priority: FieldRef<'ProcessingQueue', 'Int'>;
    readonly attempts: FieldRef<'ProcessingQueue', 'Int'>;
    readonly lastError: FieldRef<'ProcessingQueue', 'String'>;
    readonly scheduledFor: FieldRef<'ProcessingQueue', 'DateTime'>;
    readonly startedAt: FieldRef<'ProcessingQueue', 'DateTime'>;
    readonly completedAt: FieldRef<'ProcessingQueue', 'DateTime'>;
    readonly createdAt: FieldRef<'ProcessingQueue', 'DateTime'>;
    readonly updatedAt: FieldRef<'ProcessingQueue', 'DateTime'>;
    readonly paperlessInstanceId: FieldRef<'ProcessingQueue', 'String'>;
  }

  // Custom InputTypes
  /**
   * ProcessingQueue findUnique
   */
  export type ProcessingQueueFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessingQueue to fetch.
     */
    where: ProcessingQueueWhereUniqueInput;
  };

  /**
   * ProcessingQueue findUniqueOrThrow
   */
  export type ProcessingQueueFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessingQueue to fetch.
     */
    where: ProcessingQueueWhereUniqueInput;
  };

  /**
   * ProcessingQueue findFirst
   */
  export type ProcessingQueueFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessingQueue to fetch.
     */
    where?: ProcessingQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessingQueues to fetch.
     */
    orderBy?: ProcessingQueueOrderByWithRelationInput | ProcessingQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessingQueues.
     */
    cursor?: ProcessingQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessingQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessingQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessingQueues.
     */
    distinct?: ProcessingQueueScalarFieldEnum | ProcessingQueueScalarFieldEnum[];
  };

  /**
   * ProcessingQueue findFirstOrThrow
   */
  export type ProcessingQueueFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessingQueue to fetch.
     */
    where?: ProcessingQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessingQueues to fetch.
     */
    orderBy?: ProcessingQueueOrderByWithRelationInput | ProcessingQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProcessingQueues.
     */
    cursor?: ProcessingQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessingQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessingQueues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProcessingQueues.
     */
    distinct?: ProcessingQueueScalarFieldEnum | ProcessingQueueScalarFieldEnum[];
  };

  /**
   * ProcessingQueue findMany
   */
  export type ProcessingQueueFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter, which ProcessingQueues to fetch.
     */
    where?: ProcessingQueueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProcessingQueues to fetch.
     */
    orderBy?: ProcessingQueueOrderByWithRelationInput | ProcessingQueueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProcessingQueues.
     */
    cursor?: ProcessingQueueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProcessingQueues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProcessingQueues.
     */
    skip?: number;
    distinct?: ProcessingQueueScalarFieldEnum | ProcessingQueueScalarFieldEnum[];
  };

  /**
   * ProcessingQueue create
   */
  export type ProcessingQueueCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProcessingQueue.
     */
    data: XOR<ProcessingQueueCreateInput, ProcessingQueueUncheckedCreateInput>;
  };

  /**
   * ProcessingQueue createMany
   */
  export type ProcessingQueueCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProcessingQueues.
     */
    data: ProcessingQueueCreateManyInput | ProcessingQueueCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ProcessingQueue createManyAndReturn
   */
  export type ProcessingQueueCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * The data used to create many ProcessingQueues.
     */
    data: ProcessingQueueCreateManyInput | ProcessingQueueCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProcessingQueue update
   */
  export type ProcessingQueueUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProcessingQueue.
     */
    data: XOR<ProcessingQueueUpdateInput, ProcessingQueueUncheckedUpdateInput>;
    /**
     * Choose, which ProcessingQueue to update.
     */
    where: ProcessingQueueWhereUniqueInput;
  };

  /**
   * ProcessingQueue updateMany
   */
  export type ProcessingQueueUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProcessingQueues.
     */
    data: XOR<ProcessingQueueUpdateManyMutationInput, ProcessingQueueUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessingQueues to update
     */
    where?: ProcessingQueueWhereInput;
    /**
     * Limit how many ProcessingQueues to update.
     */
    limit?: number;
  };

  /**
   * ProcessingQueue updateManyAndReturn
   */
  export type ProcessingQueueUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * The data used to update ProcessingQueues.
     */
    data: XOR<ProcessingQueueUpdateManyMutationInput, ProcessingQueueUncheckedUpdateManyInput>;
    /**
     * Filter which ProcessingQueues to update
     */
    where?: ProcessingQueueWhereInput;
    /**
     * Limit how many ProcessingQueues to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProcessingQueue upsert
   */
  export type ProcessingQueueUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProcessingQueue to update in case it exists.
     */
    where: ProcessingQueueWhereUniqueInput;
    /**
     * In case the ProcessingQueue found by the `where` argument doesn't exist, create a new ProcessingQueue with this data.
     */
    create: XOR<ProcessingQueueCreateInput, ProcessingQueueUncheckedCreateInput>;
    /**
     * In case the ProcessingQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessingQueueUpdateInput, ProcessingQueueUncheckedUpdateInput>;
  };

  /**
   * ProcessingQueue delete
   */
  export type ProcessingQueueDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
    /**
     * Filter which ProcessingQueue to delete.
     */
    where: ProcessingQueueWhereUniqueInput;
  };

  /**
   * ProcessingQueue deleteMany
   */
  export type ProcessingQueueDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProcessingQueues to delete
     */
    where?: ProcessingQueueWhereInput;
    /**
     * Limit how many ProcessingQueues to delete.
     */
    limit?: number;
  };

  /**
   * ProcessingQueue without action
   */
  export type ProcessingQueueDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProcessingQueue
     */
    select?: ProcessingQueueSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ProcessingQueue
     */
    omit?: ProcessingQueueOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingQueueInclude<ExtArgs> | null;
  };

  /**
   * Model AiUsageMetric
   */

  export type AggregateAiUsageMetric = {
    _count: AiUsageMetricCountAggregateOutputType | null;
    _avg: AiUsageMetricAvgAggregateOutputType | null;
    _sum: AiUsageMetricSumAggregateOutputType | null;
    _min: AiUsageMetricMinAggregateOutputType | null;
    _max: AiUsageMetricMaxAggregateOutputType | null;
  };

  export type AiUsageMetricAvgAggregateOutputType = {
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    estimatedCost: number | null;
    documentId: number | null;
  };

  export type AiUsageMetricSumAggregateOutputType = {
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    estimatedCost: number | null;
    documentId: number | null;
  };

  export type AiUsageMetricMinAggregateOutputType = {
    id: string | null;
    provider: string | null;
    model: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    estimatedCost: number | null;
    documentId: number | null;
    createdAt: Date | null;
    userId: string | null;
    aiBotId: string | null;
  };

  export type AiUsageMetricMaxAggregateOutputType = {
    id: string | null;
    provider: string | null;
    model: string | null;
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    estimatedCost: number | null;
    documentId: number | null;
    createdAt: Date | null;
    userId: string | null;
    aiBotId: string | null;
  };

  export type AiUsageMetricCountAggregateOutputType = {
    id: number;
    provider: number;
    model: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
    documentId: number;
    createdAt: number;
    userId: number;
    aiBotId: number;
    _all: number;
  };

  export type AiUsageMetricAvgAggregateInputType = {
    promptTokens?: true;
    completionTokens?: true;
    totalTokens?: true;
    estimatedCost?: true;
    documentId?: true;
  };

  export type AiUsageMetricSumAggregateInputType = {
    promptTokens?: true;
    completionTokens?: true;
    totalTokens?: true;
    estimatedCost?: true;
    documentId?: true;
  };

  export type AiUsageMetricMinAggregateInputType = {
    id?: true;
    provider?: true;
    model?: true;
    promptTokens?: true;
    completionTokens?: true;
    totalTokens?: true;
    estimatedCost?: true;
    documentId?: true;
    createdAt?: true;
    userId?: true;
    aiBotId?: true;
  };

  export type AiUsageMetricMaxAggregateInputType = {
    id?: true;
    provider?: true;
    model?: true;
    promptTokens?: true;
    completionTokens?: true;
    totalTokens?: true;
    estimatedCost?: true;
    documentId?: true;
    createdAt?: true;
    userId?: true;
    aiBotId?: true;
  };

  export type AiUsageMetricCountAggregateInputType = {
    id?: true;
    provider?: true;
    model?: true;
    promptTokens?: true;
    completionTokens?: true;
    totalTokens?: true;
    estimatedCost?: true;
    documentId?: true;
    createdAt?: true;
    userId?: true;
    aiBotId?: true;
    _all?: true;
  };

  export type AiUsageMetricAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiUsageMetric to aggregate.
     */
    where?: AiUsageMetricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AiUsageMetricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AiUsageMetrics
     **/
    _count?: true | AiUsageMetricCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AiUsageMetricAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AiUsageMetricSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AiUsageMetricMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AiUsageMetricMaxAggregateInputType;
  };

  export type GetAiUsageMetricAggregateType<T extends AiUsageMetricAggregateArgs> = {
    [P in keyof T & keyof AggregateAiUsageMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiUsageMetric[P]>
      : GetScalarType<T[P], AggregateAiUsageMetric[P]>;
  };

  export type AiUsageMetricGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AiUsageMetricWhereInput;
    orderBy?: AiUsageMetricOrderByWithAggregationInput | AiUsageMetricOrderByWithAggregationInput[];
    by: AiUsageMetricScalarFieldEnum[] | AiUsageMetricScalarFieldEnum;
    having?: AiUsageMetricScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiUsageMetricCountAggregateInputType | true;
    _avg?: AiUsageMetricAvgAggregateInputType;
    _sum?: AiUsageMetricSumAggregateInputType;
    _min?: AiUsageMetricMinAggregateInputType;
    _max?: AiUsageMetricMaxAggregateInputType;
  };

  export type AiUsageMetricGroupByOutputType = {
    id: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number | null;
    documentId: number | null;
    createdAt: Date;
    userId: string;
    aiBotId: string | null;
    _count: AiUsageMetricCountAggregateOutputType | null;
    _avg: AiUsageMetricAvgAggregateOutputType | null;
    _sum: AiUsageMetricSumAggregateOutputType | null;
    _min: AiUsageMetricMinAggregateOutputType | null;
    _max: AiUsageMetricMaxAggregateOutputType | null;
  };

  type GetAiUsageMetricGroupByPayload<T extends AiUsageMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiUsageMetricGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AiUsageMetricGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AiUsageMetricGroupByOutputType[P]>
          : GetScalarType<T[P], AiUsageMetricGroupByOutputType[P]>;
      }
    >
  >;

  export type AiUsageMetricSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      provider?: boolean;
      model?: boolean;
      promptTokens?: boolean;
      completionTokens?: boolean;
      totalTokens?: boolean;
      estimatedCost?: boolean;
      documentId?: boolean;
      createdAt?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
    },
    ExtArgs['result']['aiUsageMetric']
  >;

  export type AiUsageMetricSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      provider?: boolean;
      model?: boolean;
      promptTokens?: boolean;
      completionTokens?: boolean;
      totalTokens?: boolean;
      estimatedCost?: boolean;
      documentId?: boolean;
      createdAt?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
    },
    ExtArgs['result']['aiUsageMetric']
  >;

  export type AiUsageMetricSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      provider?: boolean;
      model?: boolean;
      promptTokens?: boolean;
      completionTokens?: boolean;
      totalTokens?: boolean;
      estimatedCost?: boolean;
      documentId?: boolean;
      createdAt?: boolean;
      userId?: boolean;
      aiBotId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
    },
    ExtArgs['result']['aiUsageMetric']
  >;

  export type AiUsageMetricSelectScalar = {
    id?: boolean;
    provider?: boolean;
    model?: boolean;
    promptTokens?: boolean;
    completionTokens?: boolean;
    totalTokens?: boolean;
    estimatedCost?: boolean;
    documentId?: boolean;
    createdAt?: boolean;
    userId?: boolean;
    aiBotId?: boolean;
  };

  export type AiUsageMetricOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'provider'
    | 'model'
    | 'promptTokens'
    | 'completionTokens'
    | 'totalTokens'
    | 'estimatedCost'
    | 'documentId'
    | 'createdAt'
    | 'userId'
    | 'aiBotId',
    ExtArgs['result']['aiUsageMetric']
  >;
  export type AiUsageMetricInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
  };
  export type AiUsageMetricIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
  };
  export type AiUsageMetricIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    aiBot?: boolean | AiUsageMetric$aiBotArgs<ExtArgs>;
  };

  export type $AiUsageMetricPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AiUsageMetric';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      aiBot: Prisma.$AiBotPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        provider: string;
        model: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        estimatedCost: number | null;
        documentId: number | null;
        createdAt: Date;
        userId: string;
        aiBotId: string | null;
      },
      ExtArgs['result']['aiUsageMetric']
    >;
    composites: {};
  };

  type AiUsageMetricGetPayload<S extends boolean | null | undefined | AiUsageMetricDefaultArgs> =
    $Result.GetResult<Prisma.$AiUsageMetricPayload, S>;

  type AiUsageMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiUsageMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiUsageMetricCountAggregateInputType | true;
    };

  export interface AiUsageMetricDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AiUsageMetric'];
      meta: { name: 'AiUsageMetric' };
    };
    /**
     * Find zero or one AiUsageMetric that matches the filter.
     * @param {AiUsageMetricFindUniqueArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiUsageMetricFindUniqueArgs>(
      args: SelectSubset<T, AiUsageMetricFindUniqueArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AiUsageMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiUsageMetricFindUniqueOrThrowArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiUsageMetricFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AiUsageMetricFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiUsageMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindFirstArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiUsageMetricFindFirstArgs>(
      args?: SelectSubset<T, AiUsageMetricFindFirstArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AiUsageMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindFirstOrThrowArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiUsageMetricFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AiUsageMetricFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AiUsageMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiUsageMetrics
     * const aiUsageMetrics = await prisma.aiUsageMetric.findMany()
     *
     * // Get first 10 AiUsageMetrics
     * const aiUsageMetrics = await prisma.aiUsageMetric.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AiUsageMetricFindManyArgs>(
      args?: SelectSubset<T, AiUsageMetricFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a AiUsageMetric.
     * @param {AiUsageMetricCreateArgs} args - Arguments to create a AiUsageMetric.
     * @example
     * // Create one AiUsageMetric
     * const AiUsageMetric = await prisma.aiUsageMetric.create({
     *   data: {
     *     // ... data to create a AiUsageMetric
     *   }
     * })
     *
     */
    create<T extends AiUsageMetricCreateArgs>(
      args: SelectSubset<T, AiUsageMetricCreateArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AiUsageMetrics.
     * @param {AiUsageMetricCreateManyArgs} args - Arguments to create many AiUsageMetrics.
     * @example
     * // Create many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AiUsageMetricCreateManyArgs>(
      args?: SelectSubset<T, AiUsageMetricCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AiUsageMetrics and returns the data saved in the database.
     * @param {AiUsageMetricCreateManyAndReturnArgs} args - Arguments to create many AiUsageMetrics.
     * @example
     * // Create many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AiUsageMetrics and only return the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AiUsageMetricCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AiUsageMetricCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a AiUsageMetric.
     * @param {AiUsageMetricDeleteArgs} args - Arguments to delete one AiUsageMetric.
     * @example
     * // Delete one AiUsageMetric
     * const AiUsageMetric = await prisma.aiUsageMetric.delete({
     *   where: {
     *     // ... filter to delete one AiUsageMetric
     *   }
     * })
     *
     */
    delete<T extends AiUsageMetricDeleteArgs>(
      args: SelectSubset<T, AiUsageMetricDeleteArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AiUsageMetric.
     * @param {AiUsageMetricUpdateArgs} args - Arguments to update one AiUsageMetric.
     * @example
     * // Update one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AiUsageMetricUpdateArgs>(
      args: SelectSubset<T, AiUsageMetricUpdateArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AiUsageMetrics.
     * @param {AiUsageMetricDeleteManyArgs} args - Arguments to filter AiUsageMetrics to delete.
     * @example
     * // Delete a few AiUsageMetrics
     * const { count } = await prisma.aiUsageMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AiUsageMetricDeleteManyArgs>(
      args?: SelectSubset<T, AiUsageMetricDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AiUsageMetricUpdateManyArgs>(
      args: SelectSubset<T, AiUsageMetricUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AiUsageMetrics and returns the data updated in the database.
     * @param {AiUsageMetricUpdateManyAndReturnArgs} args - Arguments to update many AiUsageMetrics.
     * @example
     * // Update many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AiUsageMetrics and only return the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AiUsageMetricUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AiUsageMetricUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AiUsageMetricPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one AiUsageMetric.
     * @param {AiUsageMetricUpsertArgs} args - Arguments to update or create a AiUsageMetric.
     * @example
     * // Update or create a AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.upsert({
     *   create: {
     *     // ... data to create a AiUsageMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiUsageMetric we want to update
     *   }
     * })
     */
    upsert<T extends AiUsageMetricUpsertArgs>(
      args: SelectSubset<T, AiUsageMetricUpsertArgs<ExtArgs>>
    ): Prisma__AiUsageMetricClient<
      $Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of AiUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricCountArgs} args - Arguments to filter AiUsageMetrics to count.
     * @example
     * // Count the number of AiUsageMetrics
     * const count = await prisma.aiUsageMetric.count({
     *   where: {
     *     // ... the filter for the AiUsageMetrics we want to count
     *   }
     * })
     **/
    count<T extends AiUsageMetricCountArgs>(
      args?: Subset<T, AiUsageMetricCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiUsageMetricCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AiUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AiUsageMetricAggregateArgs>(
      args: Subset<T, AiUsageMetricAggregateArgs>
    ): Prisma.PrismaPromise<GetAiUsageMetricAggregateType<T>>;

    /**
     * Group by AiUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AiUsageMetricGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiUsageMetricGroupByArgs['orderBy'] }
        : { orderBy?: AiUsageMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AiUsageMetricGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetAiUsageMetricGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AiUsageMetric model
     */
    readonly fields: AiUsageMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiUsageMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiUsageMetricClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    aiBot<T extends AiUsageMetric$aiBotArgs<ExtArgs> = {}>(
      args?: Subset<T, AiUsageMetric$aiBotArgs<ExtArgs>>
    ): Prisma__AiBotClient<
      $Result.GetResult<
        Prisma.$AiBotPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AiUsageMetric model
   */
  interface AiUsageMetricFieldRefs {
    readonly id: FieldRef<'AiUsageMetric', 'String'>;
    readonly provider: FieldRef<'AiUsageMetric', 'String'>;
    readonly model: FieldRef<'AiUsageMetric', 'String'>;
    readonly promptTokens: FieldRef<'AiUsageMetric', 'Int'>;
    readonly completionTokens: FieldRef<'AiUsageMetric', 'Int'>;
    readonly totalTokens: FieldRef<'AiUsageMetric', 'Int'>;
    readonly estimatedCost: FieldRef<'AiUsageMetric', 'Float'>;
    readonly documentId: FieldRef<'AiUsageMetric', 'Int'>;
    readonly createdAt: FieldRef<'AiUsageMetric', 'DateTime'>;
    readonly userId: FieldRef<'AiUsageMetric', 'String'>;
    readonly aiBotId: FieldRef<'AiUsageMetric', 'String'>;
  }

  // Custom InputTypes
  /**
   * AiUsageMetric findUnique
   */
  export type AiUsageMetricFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where: AiUsageMetricWhereUniqueInput;
  };

  /**
   * AiUsageMetric findUniqueOrThrow
   */
  export type AiUsageMetricFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where: AiUsageMetricWhereUniqueInput;
  };

  /**
   * AiUsageMetric findFirst
   */
  export type AiUsageMetricFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where?: AiUsageMetricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiUsageMetrics.
     */
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[];
  };

  /**
   * AiUsageMetric findFirstOrThrow
   */
  export type AiUsageMetricFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where?: AiUsageMetricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AiUsageMetrics.
     */
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[];
  };

  /**
   * AiUsageMetric findMany
   */
  export type AiUsageMetricFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter, which AiUsageMetrics to fetch.
     */
    where?: AiUsageMetricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number;
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[];
  };

  /**
   * AiUsageMetric create
   */
  export type AiUsageMetricCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * The data needed to create a AiUsageMetric.
     */
    data: XOR<AiUsageMetricCreateInput, AiUsageMetricUncheckedCreateInput>;
  };

  /**
   * AiUsageMetric createMany
   */
  export type AiUsageMetricCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AiUsageMetrics.
     */
    data: AiUsageMetricCreateManyInput | AiUsageMetricCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AiUsageMetric createManyAndReturn
   */
  export type AiUsageMetricCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * The data used to create many AiUsageMetrics.
     */
    data: AiUsageMetricCreateManyInput | AiUsageMetricCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiUsageMetric update
   */
  export type AiUsageMetricUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * The data needed to update a AiUsageMetric.
     */
    data: XOR<AiUsageMetricUpdateInput, AiUsageMetricUncheckedUpdateInput>;
    /**
     * Choose, which AiUsageMetric to update.
     */
    where: AiUsageMetricWhereUniqueInput;
  };

  /**
   * AiUsageMetric updateMany
   */
  export type AiUsageMetricUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AiUsageMetrics.
     */
    data: XOR<AiUsageMetricUpdateManyMutationInput, AiUsageMetricUncheckedUpdateManyInput>;
    /**
     * Filter which AiUsageMetrics to update
     */
    where?: AiUsageMetricWhereInput;
    /**
     * Limit how many AiUsageMetrics to update.
     */
    limit?: number;
  };

  /**
   * AiUsageMetric updateManyAndReturn
   */
  export type AiUsageMetricUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * The data used to update AiUsageMetrics.
     */
    data: XOR<AiUsageMetricUpdateManyMutationInput, AiUsageMetricUncheckedUpdateManyInput>;
    /**
     * Filter which AiUsageMetrics to update
     */
    where?: AiUsageMetricWhereInput;
    /**
     * Limit how many AiUsageMetrics to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AiUsageMetric upsert
   */
  export type AiUsageMetricUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * The filter to search for the AiUsageMetric to update in case it exists.
     */
    where: AiUsageMetricWhereUniqueInput;
    /**
     * In case the AiUsageMetric found by the `where` argument doesn't exist, create a new AiUsageMetric with this data.
     */
    create: XOR<AiUsageMetricCreateInput, AiUsageMetricUncheckedCreateInput>;
    /**
     * In case the AiUsageMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiUsageMetricUpdateInput, AiUsageMetricUncheckedUpdateInput>;
  };

  /**
   * AiUsageMetric delete
   */
  export type AiUsageMetricDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
    /**
     * Filter which AiUsageMetric to delete.
     */
    where: AiUsageMetricWhereUniqueInput;
  };

  /**
   * AiUsageMetric deleteMany
   */
  export type AiUsageMetricDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AiUsageMetrics to delete
     */
    where?: AiUsageMetricWhereInput;
    /**
     * Limit how many AiUsageMetrics to delete.
     */
    limit?: number;
  };

  /**
   * AiUsageMetric.aiBot
   */
  export type AiUsageMetric$aiBotArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiBot
     */
    select?: AiBotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiBot
     */
    omit?: AiBotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiBotInclude<ExtArgs> | null;
    where?: AiBotWhereInput;
  };

  /**
   * AiUsageMetric without action
   */
  export type AiUsageMetricDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiUsageMetricInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const SettingScalarFieldEnum: {
    settingKey: 'settingKey';
    settingValue: 'settingValue';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type SettingScalarFieldEnum =
    (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum];

  export const UserScalarFieldEnum: {
    id: 'id';
    username: 'username';
    passwordHash: 'passwordHash';
    role: 'role';
    mustChangePassword: 'mustChangePassword';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const UserPaperlessInstanceAccessScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    instanceId: 'instanceId';
    permission: 'permission';
    createdAt: 'createdAt';
  };

  export type UserPaperlessInstanceAccessScalarFieldEnum =
    (typeof UserPaperlessInstanceAccessScalarFieldEnum)[keyof typeof UserPaperlessInstanceAccessScalarFieldEnum];

  export const UserAiProviderAccessScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    aiProviderId: 'aiProviderId';
    permission: 'permission';
    createdAt: 'createdAt';
  };

  export type UserAiProviderAccessScalarFieldEnum =
    (typeof UserAiProviderAccessScalarFieldEnum)[keyof typeof UserAiProviderAccessScalarFieldEnum];

  export const UserAiBotAccessScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    aiBotId: 'aiBotId';
    permission: 'permission';
    createdAt: 'createdAt';
  };

  export type UserAiBotAccessScalarFieldEnum =
    (typeof UserAiBotAccessScalarFieldEnum)[keyof typeof UserAiBotAccessScalarFieldEnum];

  export const PaperlessInstanceScalarFieldEnum: {
    id: 'id';
    name: 'name';
    apiUrl: 'apiUrl';
    apiToken: 'apiToken';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    ownerId: 'ownerId';
  };

  export type PaperlessInstanceScalarFieldEnum =
    (typeof PaperlessInstanceScalarFieldEnum)[keyof typeof PaperlessInstanceScalarFieldEnum];

  export const AiProviderScalarFieldEnum: {
    id: 'id';
    name: 'name';
    provider: 'provider';
    model: 'model';
    apiKey: 'apiKey';
    baseUrl: 'baseUrl';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    ownerId: 'ownerId';
  };

  export type AiProviderScalarFieldEnum =
    (typeof AiProviderScalarFieldEnum)[keyof typeof AiProviderScalarFieldEnum];

  export const AiBotScalarFieldEnum: {
    id: 'id';
    name: 'name';
    systemPrompt: 'systemPrompt';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    ownerId: 'ownerId';
    aiProviderId: 'aiProviderId';
  };

  export type AiBotScalarFieldEnum =
    (typeof AiBotScalarFieldEnum)[keyof typeof AiBotScalarFieldEnum];

  export const ProcessedDocumentScalarFieldEnum: {
    id: 'id';
    paperlessId: 'paperlessId';
    title: 'title';
    processedAt: 'processedAt';
    aiProvider: 'aiProvider';
    tokensUsed: 'tokensUsed';
    changes: 'changes';
    originalTitle: 'originalTitle';
    originalCorrespondent: 'originalCorrespondent';
    originalDocumentType: 'originalDocumentType';
    originalTags: 'originalTags';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    paperlessInstanceId: 'paperlessInstanceId';
  };

  export type ProcessedDocumentScalarFieldEnum =
    (typeof ProcessedDocumentScalarFieldEnum)[keyof typeof ProcessedDocumentScalarFieldEnum];

  export const ProcessingQueueScalarFieldEnum: {
    id: 'id';
    paperlessId: 'paperlessId';
    status: 'status';
    priority: 'priority';
    attempts: 'attempts';
    lastError: 'lastError';
    scheduledFor: 'scheduledFor';
    startedAt: 'startedAt';
    completedAt: 'completedAt';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    paperlessInstanceId: 'paperlessInstanceId';
  };

  export type ProcessingQueueScalarFieldEnum =
    (typeof ProcessingQueueScalarFieldEnum)[keyof typeof ProcessingQueueScalarFieldEnum];

  export const AiUsageMetricScalarFieldEnum: {
    id: 'id';
    provider: 'provider';
    model: 'model';
    promptTokens: 'promptTokens';
    completionTokens: 'completionTokens';
    totalTokens: 'totalTokens';
    estimatedCost: 'estimatedCost';
    documentId: 'documentId';
    createdAt: 'createdAt';
    userId: 'userId';
    aiBotId: 'aiBotId';
  };

  export type AiUsageMetricScalarFieldEnum =
    (typeof AiUsageMetricScalarFieldEnum)[keyof typeof AiUsageMetricScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;

  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'UserRole[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

  /**
   * Reference to a field of type 'Permission'
   */
  export type EnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Permission'
  >;

  /**
   * Reference to a field of type 'Permission[]'
   */
  export type ListEnumPermissionFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Permission[]'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;

  /**
   * Deep Input Types
   */

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[];
    OR?: SettingWhereInput[];
    NOT?: SettingWhereInput | SettingWhereInput[];
    settingKey?: StringFilter<'Setting'> | string;
    settingValue?: StringFilter<'Setting'> | string;
    createdAt?: DateTimeFilter<'Setting'> | Date | string;
    updatedAt?: DateTimeFilter<'Setting'> | Date | string;
  };

  export type SettingOrderByWithRelationInput = {
    settingKey?: SortOrder;
    settingValue?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SettingWhereUniqueInput = Prisma.AtLeast<
    {
      settingKey?: string;
      AND?: SettingWhereInput | SettingWhereInput[];
      OR?: SettingWhereInput[];
      NOT?: SettingWhereInput | SettingWhereInput[];
      settingValue?: StringFilter<'Setting'> | string;
      createdAt?: DateTimeFilter<'Setting'> | Date | string;
      updatedAt?: DateTimeFilter<'Setting'> | Date | string;
    },
    'settingKey'
  >;

  export type SettingOrderByWithAggregationInput = {
    settingKey?: SortOrder;
    settingValue?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: SettingCountOrderByAggregateInput;
    _max?: SettingMaxOrderByAggregateInput;
    _min?: SettingMinOrderByAggregateInput;
  };

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[];
    OR?: SettingScalarWhereWithAggregatesInput[];
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[];
    settingKey?: StringWithAggregatesFilter<'Setting'> | string;
    settingValue?: StringWithAggregatesFilter<'Setting'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Setting'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Setting'> | Date | string;
  };

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    username?: StringFilter<'User'> | string;
    passwordHash?: StringFilter<'User'> | string;
    role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
    mustChangePassword?: BoolFilter<'User'> | boolean;
    isActive?: BoolFilter<'User'> | boolean;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    updatedAt?: DateTimeFilter<'User'> | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceListRelationFilter;
    ownedAiProviders?: AiProviderListRelationFilter;
    ownedAiBots?: AiBotListRelationFilter;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessListRelationFilter;
    sharedAiProviders?: UserAiProviderAccessListRelationFilter;
    sharedAiBots?: UserAiBotAccessListRelationFilter;
    aiUsageMetrics?: AiUsageMetricListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    username?: SortOrder;
    passwordHash?: SortOrder;
    role?: SortOrder;
    mustChangePassword?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownedPaperlessInstances?: PaperlessInstanceOrderByRelationAggregateInput;
    ownedAiProviders?: AiProviderOrderByRelationAggregateInput;
    ownedAiBots?: AiBotOrderByRelationAggregateInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessOrderByRelationAggregateInput;
    sharedAiProviders?: UserAiProviderAccessOrderByRelationAggregateInput;
    sharedAiBots?: UserAiBotAccessOrderByRelationAggregateInput;
    aiUsageMetrics?: AiUsageMetricOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      username?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      passwordHash?: StringFilter<'User'> | string;
      role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
      mustChangePassword?: BoolFilter<'User'> | boolean;
      isActive?: BoolFilter<'User'> | boolean;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      ownedPaperlessInstances?: PaperlessInstanceListRelationFilter;
      ownedAiProviders?: AiProviderListRelationFilter;
      ownedAiBots?: AiBotListRelationFilter;
      sharedPaperlessInstances?: UserPaperlessInstanceAccessListRelationFilter;
      sharedAiProviders?: UserAiProviderAccessListRelationFilter;
      sharedAiBots?: UserAiBotAccessListRelationFilter;
      aiUsageMetrics?: AiUsageMetricListRelationFilter;
    },
    'id' | 'username'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    username?: SortOrder;
    passwordHash?: SortOrder;
    role?: SortOrder;
    mustChangePassword?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    username?: StringWithAggregatesFilter<'User'> | string;
    passwordHash?: StringWithAggregatesFilter<'User'> | string;
    role?: EnumUserRoleWithAggregatesFilter<'User'> | $Enums.UserRole;
    mustChangePassword?: BoolWithAggregatesFilter<'User'> | boolean;
    isActive?: BoolWithAggregatesFilter<'User'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
  };

  export type UserPaperlessInstanceAccessWhereInput = {
    AND?: UserPaperlessInstanceAccessWhereInput | UserPaperlessInstanceAccessWhereInput[];
    OR?: UserPaperlessInstanceAccessWhereInput[];
    NOT?: UserPaperlessInstanceAccessWhereInput | UserPaperlessInstanceAccessWhereInput[];
    id?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    userId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    instanceId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    permission?: EnumPermissionFilter<'UserPaperlessInstanceAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserPaperlessInstanceAccess'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    instance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
  };

  export type UserPaperlessInstanceAccessOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    instanceId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    instance?: PaperlessInstanceOrderByWithRelationInput;
  };

  export type UserPaperlessInstanceAccessWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_instanceId?: UserPaperlessInstanceAccessUserIdInstanceIdCompoundUniqueInput;
      AND?: UserPaperlessInstanceAccessWhereInput | UserPaperlessInstanceAccessWhereInput[];
      OR?: UserPaperlessInstanceAccessWhereInput[];
      NOT?: UserPaperlessInstanceAccessWhereInput | UserPaperlessInstanceAccessWhereInput[];
      userId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
      instanceId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
      permission?: EnumPermissionFilter<'UserPaperlessInstanceAccess'> | $Enums.Permission;
      createdAt?: DateTimeFilter<'UserPaperlessInstanceAccess'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      instance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
    },
    'id' | 'userId_instanceId'
  >;

  export type UserPaperlessInstanceAccessOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    instanceId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    _count?: UserPaperlessInstanceAccessCountOrderByAggregateInput;
    _max?: UserPaperlessInstanceAccessMaxOrderByAggregateInput;
    _min?: UserPaperlessInstanceAccessMinOrderByAggregateInput;
  };

  export type UserPaperlessInstanceAccessScalarWhereWithAggregatesInput = {
    AND?:
      | UserPaperlessInstanceAccessScalarWhereWithAggregatesInput
      | UserPaperlessInstanceAccessScalarWhereWithAggregatesInput[];
    OR?: UserPaperlessInstanceAccessScalarWhereWithAggregatesInput[];
    NOT?:
      | UserPaperlessInstanceAccessScalarWhereWithAggregatesInput
      | UserPaperlessInstanceAccessScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'UserPaperlessInstanceAccess'> | string;
    userId?: StringWithAggregatesFilter<'UserPaperlessInstanceAccess'> | string;
    instanceId?: StringWithAggregatesFilter<'UserPaperlessInstanceAccess'> | string;
    permission?:
      | EnumPermissionWithAggregatesFilter<'UserPaperlessInstanceAccess'>
      | $Enums.Permission;
    createdAt?: DateTimeWithAggregatesFilter<'UserPaperlessInstanceAccess'> | Date | string;
  };

  export type UserAiProviderAccessWhereInput = {
    AND?: UserAiProviderAccessWhereInput | UserAiProviderAccessWhereInput[];
    OR?: UserAiProviderAccessWhereInput[];
    NOT?: UserAiProviderAccessWhereInput | UserAiProviderAccessWhereInput[];
    id?: StringFilter<'UserAiProviderAccess'> | string;
    userId?: StringFilter<'UserAiProviderAccess'> | string;
    aiProviderId?: StringFilter<'UserAiProviderAccess'> | string;
    permission?: EnumPermissionFilter<'UserAiProviderAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserAiProviderAccess'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    aiProvider?: XOR<AiProviderScalarRelationFilter, AiProviderWhereInput>;
  };

  export type UserAiProviderAccessOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiProviderId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    aiProvider?: AiProviderOrderByWithRelationInput;
  };

  export type UserAiProviderAccessWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_aiProviderId?: UserAiProviderAccessUserIdAiProviderIdCompoundUniqueInput;
      AND?: UserAiProviderAccessWhereInput | UserAiProviderAccessWhereInput[];
      OR?: UserAiProviderAccessWhereInput[];
      NOT?: UserAiProviderAccessWhereInput | UserAiProviderAccessWhereInput[];
      userId?: StringFilter<'UserAiProviderAccess'> | string;
      aiProviderId?: StringFilter<'UserAiProviderAccess'> | string;
      permission?: EnumPermissionFilter<'UserAiProviderAccess'> | $Enums.Permission;
      createdAt?: DateTimeFilter<'UserAiProviderAccess'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      aiProvider?: XOR<AiProviderScalarRelationFilter, AiProviderWhereInput>;
    },
    'id' | 'userId_aiProviderId'
  >;

  export type UserAiProviderAccessOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiProviderId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    _count?: UserAiProviderAccessCountOrderByAggregateInput;
    _max?: UserAiProviderAccessMaxOrderByAggregateInput;
    _min?: UserAiProviderAccessMinOrderByAggregateInput;
  };

  export type UserAiProviderAccessScalarWhereWithAggregatesInput = {
    AND?:
      | UserAiProviderAccessScalarWhereWithAggregatesInput
      | UserAiProviderAccessScalarWhereWithAggregatesInput[];
    OR?: UserAiProviderAccessScalarWhereWithAggregatesInput[];
    NOT?:
      | UserAiProviderAccessScalarWhereWithAggregatesInput
      | UserAiProviderAccessScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'UserAiProviderAccess'> | string;
    userId?: StringWithAggregatesFilter<'UserAiProviderAccess'> | string;
    aiProviderId?: StringWithAggregatesFilter<'UserAiProviderAccess'> | string;
    permission?: EnumPermissionWithAggregatesFilter<'UserAiProviderAccess'> | $Enums.Permission;
    createdAt?: DateTimeWithAggregatesFilter<'UserAiProviderAccess'> | Date | string;
  };

  export type UserAiBotAccessWhereInput = {
    AND?: UserAiBotAccessWhereInput | UserAiBotAccessWhereInput[];
    OR?: UserAiBotAccessWhereInput[];
    NOT?: UserAiBotAccessWhereInput | UserAiBotAccessWhereInput[];
    id?: StringFilter<'UserAiBotAccess'> | string;
    userId?: StringFilter<'UserAiBotAccess'> | string;
    aiBotId?: StringFilter<'UserAiBotAccess'> | string;
    permission?: EnumPermissionFilter<'UserAiBotAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserAiBotAccess'> | Date | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    aiBot?: XOR<AiBotScalarRelationFilter, AiBotWhereInput>;
  };

  export type UserAiBotAccessOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
    aiBot?: AiBotOrderByWithRelationInput;
  };

  export type UserAiBotAccessWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_aiBotId?: UserAiBotAccessUserIdAiBotIdCompoundUniqueInput;
      AND?: UserAiBotAccessWhereInput | UserAiBotAccessWhereInput[];
      OR?: UserAiBotAccessWhereInput[];
      NOT?: UserAiBotAccessWhereInput | UserAiBotAccessWhereInput[];
      userId?: StringFilter<'UserAiBotAccess'> | string;
      aiBotId?: StringFilter<'UserAiBotAccess'> | string;
      permission?: EnumPermissionFilter<'UserAiBotAccess'> | $Enums.Permission;
      createdAt?: DateTimeFilter<'UserAiBotAccess'> | Date | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      aiBot?: XOR<AiBotScalarRelationFilter, AiBotWhereInput>;
    },
    'id' | 'userId_aiBotId'
  >;

  export type UserAiBotAccessOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
    _count?: UserAiBotAccessCountOrderByAggregateInput;
    _max?: UserAiBotAccessMaxOrderByAggregateInput;
    _min?: UserAiBotAccessMinOrderByAggregateInput;
  };

  export type UserAiBotAccessScalarWhereWithAggregatesInput = {
    AND?:
      | UserAiBotAccessScalarWhereWithAggregatesInput
      | UserAiBotAccessScalarWhereWithAggregatesInput[];
    OR?: UserAiBotAccessScalarWhereWithAggregatesInput[];
    NOT?:
      | UserAiBotAccessScalarWhereWithAggregatesInput
      | UserAiBotAccessScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'UserAiBotAccess'> | string;
    userId?: StringWithAggregatesFilter<'UserAiBotAccess'> | string;
    aiBotId?: StringWithAggregatesFilter<'UserAiBotAccess'> | string;
    permission?: EnumPermissionWithAggregatesFilter<'UserAiBotAccess'> | $Enums.Permission;
    createdAt?: DateTimeWithAggregatesFilter<'UserAiBotAccess'> | Date | string;
  };

  export type PaperlessInstanceWhereInput = {
    AND?: PaperlessInstanceWhereInput | PaperlessInstanceWhereInput[];
    OR?: PaperlessInstanceWhereInput[];
    NOT?: PaperlessInstanceWhereInput | PaperlessInstanceWhereInput[];
    id?: StringFilter<'PaperlessInstance'> | string;
    name?: StringFilter<'PaperlessInstance'> | string;
    apiUrl?: StringFilter<'PaperlessInstance'> | string;
    apiToken?: StringFilter<'PaperlessInstance'> | string;
    isActive?: BoolFilter<'PaperlessInstance'> | boolean;
    createdAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
    updatedAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
    ownerId?: StringFilter<'PaperlessInstance'> | string;
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
    sharedWith?: UserPaperlessInstanceAccessListRelationFilter;
    processedDocuments?: ProcessedDocumentListRelationFilter;
    processingQueue?: ProcessingQueueListRelationFilter;
  };

  export type PaperlessInstanceOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    apiUrl?: SortOrder;
    apiToken?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    owner?: UserOrderByWithRelationInput;
    sharedWith?: UserPaperlessInstanceAccessOrderByRelationAggregateInput;
    processedDocuments?: ProcessedDocumentOrderByRelationAggregateInput;
    processingQueue?: ProcessingQueueOrderByRelationAggregateInput;
  };

  export type PaperlessInstanceWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      ownerId_name?: PaperlessInstanceOwnerIdNameCompoundUniqueInput;
      AND?: PaperlessInstanceWhereInput | PaperlessInstanceWhereInput[];
      OR?: PaperlessInstanceWhereInput[];
      NOT?: PaperlessInstanceWhereInput | PaperlessInstanceWhereInput[];
      name?: StringFilter<'PaperlessInstance'> | string;
      apiUrl?: StringFilter<'PaperlessInstance'> | string;
      apiToken?: StringFilter<'PaperlessInstance'> | string;
      isActive?: BoolFilter<'PaperlessInstance'> | boolean;
      createdAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
      updatedAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
      ownerId?: StringFilter<'PaperlessInstance'> | string;
      owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
      sharedWith?: UserPaperlessInstanceAccessListRelationFilter;
      processedDocuments?: ProcessedDocumentListRelationFilter;
      processingQueue?: ProcessingQueueListRelationFilter;
    },
    'id' | 'ownerId_name'
  >;

  export type PaperlessInstanceOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    apiUrl?: SortOrder;
    apiToken?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    _count?: PaperlessInstanceCountOrderByAggregateInput;
    _max?: PaperlessInstanceMaxOrderByAggregateInput;
    _min?: PaperlessInstanceMinOrderByAggregateInput;
  };

  export type PaperlessInstanceScalarWhereWithAggregatesInput = {
    AND?:
      | PaperlessInstanceScalarWhereWithAggregatesInput
      | PaperlessInstanceScalarWhereWithAggregatesInput[];
    OR?: PaperlessInstanceScalarWhereWithAggregatesInput[];
    NOT?:
      | PaperlessInstanceScalarWhereWithAggregatesInput
      | PaperlessInstanceScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PaperlessInstance'> | string;
    name?: StringWithAggregatesFilter<'PaperlessInstance'> | string;
    apiUrl?: StringWithAggregatesFilter<'PaperlessInstance'> | string;
    apiToken?: StringWithAggregatesFilter<'PaperlessInstance'> | string;
    isActive?: BoolWithAggregatesFilter<'PaperlessInstance'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'PaperlessInstance'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'PaperlessInstance'> | Date | string;
    ownerId?: StringWithAggregatesFilter<'PaperlessInstance'> | string;
  };

  export type AiProviderWhereInput = {
    AND?: AiProviderWhereInput | AiProviderWhereInput[];
    OR?: AiProviderWhereInput[];
    NOT?: AiProviderWhereInput | AiProviderWhereInput[];
    id?: StringFilter<'AiProvider'> | string;
    name?: StringFilter<'AiProvider'> | string;
    provider?: StringFilter<'AiProvider'> | string;
    model?: StringFilter<'AiProvider'> | string;
    apiKey?: StringFilter<'AiProvider'> | string;
    baseUrl?: StringNullableFilter<'AiProvider'> | string | null;
    isActive?: BoolFilter<'AiProvider'> | boolean;
    createdAt?: DateTimeFilter<'AiProvider'> | Date | string;
    updatedAt?: DateTimeFilter<'AiProvider'> | Date | string;
    ownerId?: StringFilter<'AiProvider'> | string;
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
    sharedWith?: UserAiProviderAccessListRelationFilter;
    bots?: AiBotListRelationFilter;
  };

  export type AiProviderOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    apiKey?: SortOrder;
    baseUrl?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    owner?: UserOrderByWithRelationInput;
    sharedWith?: UserAiProviderAccessOrderByRelationAggregateInput;
    bots?: AiBotOrderByRelationAggregateInput;
  };

  export type AiProviderWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      ownerId_name?: AiProviderOwnerIdNameCompoundUniqueInput;
      AND?: AiProviderWhereInput | AiProviderWhereInput[];
      OR?: AiProviderWhereInput[];
      NOT?: AiProviderWhereInput | AiProviderWhereInput[];
      name?: StringFilter<'AiProvider'> | string;
      provider?: StringFilter<'AiProvider'> | string;
      model?: StringFilter<'AiProvider'> | string;
      apiKey?: StringFilter<'AiProvider'> | string;
      baseUrl?: StringNullableFilter<'AiProvider'> | string | null;
      isActive?: BoolFilter<'AiProvider'> | boolean;
      createdAt?: DateTimeFilter<'AiProvider'> | Date | string;
      updatedAt?: DateTimeFilter<'AiProvider'> | Date | string;
      ownerId?: StringFilter<'AiProvider'> | string;
      owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
      sharedWith?: UserAiProviderAccessListRelationFilter;
      bots?: AiBotListRelationFilter;
    },
    'id' | 'ownerId_name'
  >;

  export type AiProviderOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    apiKey?: SortOrder;
    baseUrl?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    _count?: AiProviderCountOrderByAggregateInput;
    _max?: AiProviderMaxOrderByAggregateInput;
    _min?: AiProviderMinOrderByAggregateInput;
  };

  export type AiProviderScalarWhereWithAggregatesInput = {
    AND?: AiProviderScalarWhereWithAggregatesInput | AiProviderScalarWhereWithAggregatesInput[];
    OR?: AiProviderScalarWhereWithAggregatesInput[];
    NOT?: AiProviderScalarWhereWithAggregatesInput | AiProviderScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AiProvider'> | string;
    name?: StringWithAggregatesFilter<'AiProvider'> | string;
    provider?: StringWithAggregatesFilter<'AiProvider'> | string;
    model?: StringWithAggregatesFilter<'AiProvider'> | string;
    apiKey?: StringWithAggregatesFilter<'AiProvider'> | string;
    baseUrl?: StringNullableWithAggregatesFilter<'AiProvider'> | string | null;
    isActive?: BoolWithAggregatesFilter<'AiProvider'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'AiProvider'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'AiProvider'> | Date | string;
    ownerId?: StringWithAggregatesFilter<'AiProvider'> | string;
  };

  export type AiBotWhereInput = {
    AND?: AiBotWhereInput | AiBotWhereInput[];
    OR?: AiBotWhereInput[];
    NOT?: AiBotWhereInput | AiBotWhereInput[];
    id?: StringFilter<'AiBot'> | string;
    name?: StringFilter<'AiBot'> | string;
    systemPrompt?: StringFilter<'AiBot'> | string;
    isActive?: BoolFilter<'AiBot'> | boolean;
    createdAt?: DateTimeFilter<'AiBot'> | Date | string;
    updatedAt?: DateTimeFilter<'AiBot'> | Date | string;
    ownerId?: StringFilter<'AiBot'> | string;
    aiProviderId?: StringFilter<'AiBot'> | string;
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
    aiProvider?: XOR<AiProviderScalarRelationFilter, AiProviderWhereInput>;
    sharedWith?: UserAiBotAccessListRelationFilter;
    aiUsageMetrics?: AiUsageMetricListRelationFilter;
  };

  export type AiBotOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    systemPrompt?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    aiProviderId?: SortOrder;
    owner?: UserOrderByWithRelationInput;
    aiProvider?: AiProviderOrderByWithRelationInput;
    sharedWith?: UserAiBotAccessOrderByRelationAggregateInput;
    aiUsageMetrics?: AiUsageMetricOrderByRelationAggregateInput;
  };

  export type AiBotWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      ownerId_name?: AiBotOwnerIdNameCompoundUniqueInput;
      AND?: AiBotWhereInput | AiBotWhereInput[];
      OR?: AiBotWhereInput[];
      NOT?: AiBotWhereInput | AiBotWhereInput[];
      name?: StringFilter<'AiBot'> | string;
      systemPrompt?: StringFilter<'AiBot'> | string;
      isActive?: BoolFilter<'AiBot'> | boolean;
      createdAt?: DateTimeFilter<'AiBot'> | Date | string;
      updatedAt?: DateTimeFilter<'AiBot'> | Date | string;
      ownerId?: StringFilter<'AiBot'> | string;
      aiProviderId?: StringFilter<'AiBot'> | string;
      owner?: XOR<UserScalarRelationFilter, UserWhereInput>;
      aiProvider?: XOR<AiProviderScalarRelationFilter, AiProviderWhereInput>;
      sharedWith?: UserAiBotAccessListRelationFilter;
      aiUsageMetrics?: AiUsageMetricListRelationFilter;
    },
    'id' | 'ownerId_name'
  >;

  export type AiBotOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    systemPrompt?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    aiProviderId?: SortOrder;
    _count?: AiBotCountOrderByAggregateInput;
    _max?: AiBotMaxOrderByAggregateInput;
    _min?: AiBotMinOrderByAggregateInput;
  };

  export type AiBotScalarWhereWithAggregatesInput = {
    AND?: AiBotScalarWhereWithAggregatesInput | AiBotScalarWhereWithAggregatesInput[];
    OR?: AiBotScalarWhereWithAggregatesInput[];
    NOT?: AiBotScalarWhereWithAggregatesInput | AiBotScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AiBot'> | string;
    name?: StringWithAggregatesFilter<'AiBot'> | string;
    systemPrompt?: StringWithAggregatesFilter<'AiBot'> | string;
    isActive?: BoolWithAggregatesFilter<'AiBot'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'AiBot'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'AiBot'> | Date | string;
    ownerId?: StringWithAggregatesFilter<'AiBot'> | string;
    aiProviderId?: StringWithAggregatesFilter<'AiBot'> | string;
  };

  export type ProcessedDocumentWhereInput = {
    AND?: ProcessedDocumentWhereInput | ProcessedDocumentWhereInput[];
    OR?: ProcessedDocumentWhereInput[];
    NOT?: ProcessedDocumentWhereInput | ProcessedDocumentWhereInput[];
    id?: StringFilter<'ProcessedDocument'> | string;
    paperlessId?: IntFilter<'ProcessedDocument'> | number;
    title?: StringFilter<'ProcessedDocument'> | string;
    processedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    aiProvider?: StringFilter<'ProcessedDocument'> | string;
    tokensUsed?: IntFilter<'ProcessedDocument'> | number;
    changes?: JsonNullableFilter<'ProcessedDocument'>;
    originalTitle?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalCorrespondent?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalDocumentType?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalTags?: StringNullableListFilter<'ProcessedDocument'>;
    createdAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    updatedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    paperlessInstanceId?: StringFilter<'ProcessedDocument'> | string;
    paperlessInstance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
  };

  export type ProcessedDocumentOrderByWithRelationInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    title?: SortOrder;
    processedAt?: SortOrder;
    aiProvider?: SortOrder;
    tokensUsed?: SortOrder;
    changes?: SortOrderInput | SortOrder;
    originalTitle?: SortOrderInput | SortOrder;
    originalCorrespondent?: SortOrderInput | SortOrder;
    originalDocumentType?: SortOrderInput | SortOrder;
    originalTags?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
    paperlessInstance?: PaperlessInstanceOrderByWithRelationInput;
  };

  export type ProcessedDocumentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      paperlessInstanceId_paperlessId?: ProcessedDocumentPaperlessInstanceIdPaperlessIdCompoundUniqueInput;
      AND?: ProcessedDocumentWhereInput | ProcessedDocumentWhereInput[];
      OR?: ProcessedDocumentWhereInput[];
      NOT?: ProcessedDocumentWhereInput | ProcessedDocumentWhereInput[];
      paperlessId?: IntFilter<'ProcessedDocument'> | number;
      title?: StringFilter<'ProcessedDocument'> | string;
      processedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
      aiProvider?: StringFilter<'ProcessedDocument'> | string;
      tokensUsed?: IntFilter<'ProcessedDocument'> | number;
      changes?: JsonNullableFilter<'ProcessedDocument'>;
      originalTitle?: StringNullableFilter<'ProcessedDocument'> | string | null;
      originalCorrespondent?: StringNullableFilter<'ProcessedDocument'> | string | null;
      originalDocumentType?: StringNullableFilter<'ProcessedDocument'> | string | null;
      originalTags?: StringNullableListFilter<'ProcessedDocument'>;
      createdAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
      updatedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
      paperlessInstanceId?: StringFilter<'ProcessedDocument'> | string;
      paperlessInstance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
    },
    'id' | 'paperlessInstanceId_paperlessId'
  >;

  export type ProcessedDocumentOrderByWithAggregationInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    title?: SortOrder;
    processedAt?: SortOrder;
    aiProvider?: SortOrder;
    tokensUsed?: SortOrder;
    changes?: SortOrderInput | SortOrder;
    originalTitle?: SortOrderInput | SortOrder;
    originalCorrespondent?: SortOrderInput | SortOrder;
    originalDocumentType?: SortOrderInput | SortOrder;
    originalTags?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
    _count?: ProcessedDocumentCountOrderByAggregateInput;
    _avg?: ProcessedDocumentAvgOrderByAggregateInput;
    _max?: ProcessedDocumentMaxOrderByAggregateInput;
    _min?: ProcessedDocumentMinOrderByAggregateInput;
    _sum?: ProcessedDocumentSumOrderByAggregateInput;
  };

  export type ProcessedDocumentScalarWhereWithAggregatesInput = {
    AND?:
      | ProcessedDocumentScalarWhereWithAggregatesInput
      | ProcessedDocumentScalarWhereWithAggregatesInput[];
    OR?: ProcessedDocumentScalarWhereWithAggregatesInput[];
    NOT?:
      | ProcessedDocumentScalarWhereWithAggregatesInput
      | ProcessedDocumentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ProcessedDocument'> | string;
    paperlessId?: IntWithAggregatesFilter<'ProcessedDocument'> | number;
    title?: StringWithAggregatesFilter<'ProcessedDocument'> | string;
    processedAt?: DateTimeWithAggregatesFilter<'ProcessedDocument'> | Date | string;
    aiProvider?: StringWithAggregatesFilter<'ProcessedDocument'> | string;
    tokensUsed?: IntWithAggregatesFilter<'ProcessedDocument'> | number;
    changes?: JsonNullableWithAggregatesFilter<'ProcessedDocument'>;
    originalTitle?: StringNullableWithAggregatesFilter<'ProcessedDocument'> | string | null;
    originalCorrespondent?: StringNullableWithAggregatesFilter<'ProcessedDocument'> | string | null;
    originalDocumentType?: StringNullableWithAggregatesFilter<'ProcessedDocument'> | string | null;
    originalTags?: StringNullableListFilter<'ProcessedDocument'>;
    createdAt?: DateTimeWithAggregatesFilter<'ProcessedDocument'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'ProcessedDocument'> | Date | string;
    paperlessInstanceId?: StringWithAggregatesFilter<'ProcessedDocument'> | string;
  };

  export type ProcessingQueueWhereInput = {
    AND?: ProcessingQueueWhereInput | ProcessingQueueWhereInput[];
    OR?: ProcessingQueueWhereInput[];
    NOT?: ProcessingQueueWhereInput | ProcessingQueueWhereInput[];
    id?: StringFilter<'ProcessingQueue'> | string;
    paperlessId?: IntFilter<'ProcessingQueue'> | number;
    status?: StringFilter<'ProcessingQueue'> | string;
    priority?: IntFilter<'ProcessingQueue'> | number;
    attempts?: IntFilter<'ProcessingQueue'> | number;
    lastError?: StringNullableFilter<'ProcessingQueue'> | string | null;
    scheduledFor?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    startedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
    completedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
    createdAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    updatedAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    paperlessInstanceId?: StringFilter<'ProcessingQueue'> | string;
    paperlessInstance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
  };

  export type ProcessingQueueOrderByWithRelationInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    status?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
    lastError?: SortOrderInput | SortOrder;
    scheduledFor?: SortOrder;
    startedAt?: SortOrderInput | SortOrder;
    completedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
    paperlessInstance?: PaperlessInstanceOrderByWithRelationInput;
  };

  export type ProcessingQueueWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      paperlessInstanceId_paperlessId?: ProcessingQueuePaperlessInstanceIdPaperlessIdCompoundUniqueInput;
      AND?: ProcessingQueueWhereInput | ProcessingQueueWhereInput[];
      OR?: ProcessingQueueWhereInput[];
      NOT?: ProcessingQueueWhereInput | ProcessingQueueWhereInput[];
      paperlessId?: IntFilter<'ProcessingQueue'> | number;
      status?: StringFilter<'ProcessingQueue'> | string;
      priority?: IntFilter<'ProcessingQueue'> | number;
      attempts?: IntFilter<'ProcessingQueue'> | number;
      lastError?: StringNullableFilter<'ProcessingQueue'> | string | null;
      scheduledFor?: DateTimeFilter<'ProcessingQueue'> | Date | string;
      startedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
      completedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
      createdAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
      updatedAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
      paperlessInstanceId?: StringFilter<'ProcessingQueue'> | string;
      paperlessInstance?: XOR<PaperlessInstanceScalarRelationFilter, PaperlessInstanceWhereInput>;
    },
    'id' | 'paperlessInstanceId_paperlessId'
  >;

  export type ProcessingQueueOrderByWithAggregationInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    status?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
    lastError?: SortOrderInput | SortOrder;
    scheduledFor?: SortOrder;
    startedAt?: SortOrderInput | SortOrder;
    completedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
    _count?: ProcessingQueueCountOrderByAggregateInput;
    _avg?: ProcessingQueueAvgOrderByAggregateInput;
    _max?: ProcessingQueueMaxOrderByAggregateInput;
    _min?: ProcessingQueueMinOrderByAggregateInput;
    _sum?: ProcessingQueueSumOrderByAggregateInput;
  };

  export type ProcessingQueueScalarWhereWithAggregatesInput = {
    AND?:
      | ProcessingQueueScalarWhereWithAggregatesInput
      | ProcessingQueueScalarWhereWithAggregatesInput[];
    OR?: ProcessingQueueScalarWhereWithAggregatesInput[];
    NOT?:
      | ProcessingQueueScalarWhereWithAggregatesInput
      | ProcessingQueueScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ProcessingQueue'> | string;
    paperlessId?: IntWithAggregatesFilter<'ProcessingQueue'> | number;
    status?: StringWithAggregatesFilter<'ProcessingQueue'> | string;
    priority?: IntWithAggregatesFilter<'ProcessingQueue'> | number;
    attempts?: IntWithAggregatesFilter<'ProcessingQueue'> | number;
    lastError?: StringNullableWithAggregatesFilter<'ProcessingQueue'> | string | null;
    scheduledFor?: DateTimeWithAggregatesFilter<'ProcessingQueue'> | Date | string;
    startedAt?: DateTimeNullableWithAggregatesFilter<'ProcessingQueue'> | Date | string | null;
    completedAt?: DateTimeNullableWithAggregatesFilter<'ProcessingQueue'> | Date | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'ProcessingQueue'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'ProcessingQueue'> | Date | string;
    paperlessInstanceId?: StringWithAggregatesFilter<'ProcessingQueue'> | string;
  };

  export type AiUsageMetricWhereInput = {
    AND?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[];
    OR?: AiUsageMetricWhereInput[];
    NOT?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[];
    id?: StringFilter<'AiUsageMetric'> | string;
    provider?: StringFilter<'AiUsageMetric'> | string;
    model?: StringFilter<'AiUsageMetric'> | string;
    promptTokens?: IntFilter<'AiUsageMetric'> | number;
    completionTokens?: IntFilter<'AiUsageMetric'> | number;
    totalTokens?: IntFilter<'AiUsageMetric'> | number;
    estimatedCost?: FloatNullableFilter<'AiUsageMetric'> | number | null;
    documentId?: IntNullableFilter<'AiUsageMetric'> | number | null;
    createdAt?: DateTimeFilter<'AiUsageMetric'> | Date | string;
    userId?: StringFilter<'AiUsageMetric'> | string;
    aiBotId?: StringNullableFilter<'AiUsageMetric'> | string | null;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    aiBot?: XOR<AiBotNullableScalarRelationFilter, AiBotWhereInput> | null;
  };

  export type AiUsageMetricOrderByWithRelationInput = {
    id?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrderInput | SortOrder;
    documentId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrderInput | SortOrder;
    user?: UserOrderByWithRelationInput;
    aiBot?: AiBotOrderByWithRelationInput;
  };

  export type AiUsageMetricWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[];
      OR?: AiUsageMetricWhereInput[];
      NOT?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[];
      provider?: StringFilter<'AiUsageMetric'> | string;
      model?: StringFilter<'AiUsageMetric'> | string;
      promptTokens?: IntFilter<'AiUsageMetric'> | number;
      completionTokens?: IntFilter<'AiUsageMetric'> | number;
      totalTokens?: IntFilter<'AiUsageMetric'> | number;
      estimatedCost?: FloatNullableFilter<'AiUsageMetric'> | number | null;
      documentId?: IntNullableFilter<'AiUsageMetric'> | number | null;
      createdAt?: DateTimeFilter<'AiUsageMetric'> | Date | string;
      userId?: StringFilter<'AiUsageMetric'> | string;
      aiBotId?: StringNullableFilter<'AiUsageMetric'> | string | null;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      aiBot?: XOR<AiBotNullableScalarRelationFilter, AiBotWhereInput> | null;
    },
    'id'
  >;

  export type AiUsageMetricOrderByWithAggregationInput = {
    id?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrderInput | SortOrder;
    documentId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrderInput | SortOrder;
    _count?: AiUsageMetricCountOrderByAggregateInput;
    _avg?: AiUsageMetricAvgOrderByAggregateInput;
    _max?: AiUsageMetricMaxOrderByAggregateInput;
    _min?: AiUsageMetricMinOrderByAggregateInput;
    _sum?: AiUsageMetricSumOrderByAggregateInput;
  };

  export type AiUsageMetricScalarWhereWithAggregatesInput = {
    AND?:
      | AiUsageMetricScalarWhereWithAggregatesInput
      | AiUsageMetricScalarWhereWithAggregatesInput[];
    OR?: AiUsageMetricScalarWhereWithAggregatesInput[];
    NOT?:
      | AiUsageMetricScalarWhereWithAggregatesInput
      | AiUsageMetricScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AiUsageMetric'> | string;
    provider?: StringWithAggregatesFilter<'AiUsageMetric'> | string;
    model?: StringWithAggregatesFilter<'AiUsageMetric'> | string;
    promptTokens?: IntWithAggregatesFilter<'AiUsageMetric'> | number;
    completionTokens?: IntWithAggregatesFilter<'AiUsageMetric'> | number;
    totalTokens?: IntWithAggregatesFilter<'AiUsageMetric'> | number;
    estimatedCost?: FloatNullableWithAggregatesFilter<'AiUsageMetric'> | number | null;
    documentId?: IntNullableWithAggregatesFilter<'AiUsageMetric'> | number | null;
    createdAt?: DateTimeWithAggregatesFilter<'AiUsageMetric'> | Date | string;
    userId?: StringWithAggregatesFilter<'AiUsageMetric'> | string;
    aiBotId?: StringNullableWithAggregatesFilter<'AiUsageMetric'> | string | null;
  };

  export type SettingCreateInput = {
    settingKey: string;
    settingValue: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SettingUncheckedCreateInput = {
    settingKey: string;
    settingValue: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SettingUpdateInput = {
    settingKey?: StringFieldUpdateOperationsInput | string;
    settingValue?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SettingUncheckedUpdateInput = {
    settingKey?: StringFieldUpdateOperationsInput | string;
    settingValue?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SettingCreateManyInput = {
    settingKey: string;
    settingValue: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type SettingUpdateManyMutationInput = {
    settingKey?: StringFieldUpdateOperationsInput | string;
    settingValue?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SettingUncheckedUpdateManyInput = {
    settingKey?: StringFieldUpdateOperationsInput | string;
    settingValue?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserPaperlessInstanceAccessCreateInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedPaperlessInstancesInput;
    instance: PaperlessInstanceCreateNestedOneWithoutSharedWithInput;
  };

  export type UserPaperlessInstanceAccessUncheckedCreateInput = {
    id?: string;
    userId: string;
    instanceId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserPaperlessInstanceAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedPaperlessInstancesNestedInput;
    instance?: PaperlessInstanceUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    instanceId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserPaperlessInstanceAccessCreateManyInput = {
    id?: string;
    userId: string;
    instanceId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserPaperlessInstanceAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    instanceId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessCreateInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedAiProvidersInput;
    aiProvider: AiProviderCreateNestedOneWithoutSharedWithInput;
  };

  export type UserAiProviderAccessUncheckedCreateInput = {
    id?: string;
    userId: string;
    aiProviderId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiProviderAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedAiProvidersNestedInput;
    aiProvider?: AiProviderUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserAiProviderAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessCreateManyInput = {
    id?: string;
    userId: string;
    aiProviderId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiProviderAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessCreateInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedAiBotsInput;
    aiBot: AiBotCreateNestedOneWithoutSharedWithInput;
  };

  export type UserAiBotAccessUncheckedCreateInput = {
    id?: string;
    userId: string;
    aiBotId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiBotAccessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedAiBotsNestedInput;
    aiBot?: AiBotUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserAiBotAccessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiBotId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessCreateManyInput = {
    id?: string;
    userId: string;
    aiBotId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiBotAccessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiBotId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PaperlessInstanceCreateInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedPaperlessInstancesInput;
    sharedWith?: UserPaperlessInstanceAccessCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUncheckedCreateInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedPaperlessInstancesNestedInput;
    sharedWith?: UserPaperlessInstanceAccessUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceCreateManyInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
  };

  export type PaperlessInstanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PaperlessInstanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
  };

  export type AiProviderCreateInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiProvidersInput;
    sharedWith?: UserAiProviderAccessCreateNestedManyWithoutAiProviderInput;
    bots?: AiBotCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderUncheckedCreateInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserAiProviderAccessUncheckedCreateNestedManyWithoutAiProviderInput;
    bots?: AiBotUncheckedCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiProvidersNestedInput;
    sharedWith?: UserAiProviderAccessUpdateManyWithoutAiProviderNestedInput;
    bots?: AiBotUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderNestedInput;
    bots?: AiBotUncheckedUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderCreateManyInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
  };

  export type AiProviderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiProviderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
  };

  export type AiBotCreateInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiBotsInput;
    aiProvider: AiProviderCreateNestedOneWithoutBotsInput;
    sharedWith?: UserAiBotAccessCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUncheckedCreateInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    aiProviderId: string;
    sharedWith?: UserAiBotAccessUncheckedCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiBotsNestedInput;
    aiProvider?: AiProviderUpdateOneRequiredWithoutBotsNestedInput;
    sharedWith?: UserAiBotAccessUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiBotAccessUncheckedUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotCreateManyInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    aiProviderId: string;
  };

  export type AiBotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiBotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProcessedDocumentCreateInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstance: PaperlessInstanceCreateNestedOneWithoutProcessedDocumentsInput;
  };

  export type ProcessedDocumentUncheckedCreateInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstanceId: string;
  };

  export type ProcessedDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstance?: PaperlessInstanceUpdateOneRequiredWithoutProcessedDocumentsNestedInput;
  };

  export type ProcessedDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstanceId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProcessedDocumentCreateManyInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstanceId: string;
  };

  export type ProcessedDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessedDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstanceId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProcessingQueueCreateInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstance: PaperlessInstanceCreateNestedOneWithoutProcessingQueueInput;
  };

  export type ProcessingQueueUncheckedCreateInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstanceId: string;
  };

  export type ProcessingQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstance?: PaperlessInstanceUpdateOneRequiredWithoutProcessingQueueNestedInput;
  };

  export type ProcessingQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstanceId?: StringFieldUpdateOperationsInput | string;
  };

  export type ProcessingQueueCreateManyInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paperlessInstanceId: string;
  };

  export type ProcessingQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessingQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paperlessInstanceId?: StringFieldUpdateOperationsInput | string;
  };

  export type AiUsageMetricCreateInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutAiUsageMetricsInput;
    aiBot?: AiBotCreateNestedOneWithoutAiUsageMetricsInput;
  };

  export type AiUsageMetricUncheckedCreateInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    userId: string;
    aiBotId?: string | null;
  };

  export type AiUsageMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAiUsageMetricsNestedInput;
    aiBot?: AiBotUpdateOneWithoutAiUsageMetricsNestedInput;
  };

  export type AiUsageMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiBotId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AiUsageMetricCreateManyInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    userId: string;
    aiBotId?: string | null;
  };

  export type AiUsageMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiUsageMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
    aiBotId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type SettingCountOrderByAggregateInput = {
    settingKey?: SortOrder;
    settingValue?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SettingMaxOrderByAggregateInput = {
    settingKey?: SortOrder;
    settingValue?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type SettingMinOrderByAggregateInput = {
    settingKey?: SortOrder;
    settingValue?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type PaperlessInstanceListRelationFilter = {
    every?: PaperlessInstanceWhereInput;
    some?: PaperlessInstanceWhereInput;
    none?: PaperlessInstanceWhereInput;
  };

  export type AiProviderListRelationFilter = {
    every?: AiProviderWhereInput;
    some?: AiProviderWhereInput;
    none?: AiProviderWhereInput;
  };

  export type AiBotListRelationFilter = {
    every?: AiBotWhereInput;
    some?: AiBotWhereInput;
    none?: AiBotWhereInput;
  };

  export type UserPaperlessInstanceAccessListRelationFilter = {
    every?: UserPaperlessInstanceAccessWhereInput;
    some?: UserPaperlessInstanceAccessWhereInput;
    none?: UserPaperlessInstanceAccessWhereInput;
  };

  export type UserAiProviderAccessListRelationFilter = {
    every?: UserAiProviderAccessWhereInput;
    some?: UserAiProviderAccessWhereInput;
    none?: UserAiProviderAccessWhereInput;
  };

  export type UserAiBotAccessListRelationFilter = {
    every?: UserAiBotAccessWhereInput;
    some?: UserAiBotAccessWhereInput;
    none?: UserAiBotAccessWhereInput;
  };

  export type AiUsageMetricListRelationFilter = {
    every?: AiUsageMetricWhereInput;
    some?: AiUsageMetricWhereInput;
    none?: AiUsageMetricWhereInput;
  };

  export type PaperlessInstanceOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AiProviderOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AiBotOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserPaperlessInstanceAccessOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserAiProviderAccessOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserAiBotAccessOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AiUsageMetricOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    passwordHash?: SortOrder;
    role?: SortOrder;
    mustChangePassword?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    passwordHash?: SortOrder;
    role?: SortOrder;
    mustChangePassword?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    passwordHash?: SortOrder;
    role?: SortOrder;
    mustChangePassword?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type EnumPermissionFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel>;
    in?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    not?: NestedEnumPermissionFilter<$PrismaModel> | $Enums.Permission;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type PaperlessInstanceScalarRelationFilter = {
    is?: PaperlessInstanceWhereInput;
    isNot?: PaperlessInstanceWhereInput;
  };

  export type UserPaperlessInstanceAccessUserIdInstanceIdCompoundUniqueInput = {
    userId: string;
    instanceId: string;
  };

  export type UserPaperlessInstanceAccessCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    instanceId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserPaperlessInstanceAccessMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    instanceId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserPaperlessInstanceAccessMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    instanceId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumPermissionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel>;
    in?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    not?: NestedEnumPermissionWithAggregatesFilter<$PrismaModel> | $Enums.Permission;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPermissionFilter<$PrismaModel>;
    _max?: NestedEnumPermissionFilter<$PrismaModel>;
  };

  export type AiProviderScalarRelationFilter = {
    is?: AiProviderWhereInput;
    isNot?: AiProviderWhereInput;
  };

  export type UserAiProviderAccessUserIdAiProviderIdCompoundUniqueInput = {
    userId: string;
    aiProviderId: string;
  };

  export type UserAiProviderAccessCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiProviderId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserAiProviderAccessMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiProviderId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserAiProviderAccessMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiProviderId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type AiBotScalarRelationFilter = {
    is?: AiBotWhereInput;
    isNot?: AiBotWhereInput;
  };

  export type UserAiBotAccessUserIdAiBotIdCompoundUniqueInput = {
    userId: string;
    aiBotId: string;
  };

  export type UserAiBotAccessCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserAiBotAccessMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type UserAiBotAccessMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
    permission?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ProcessedDocumentListRelationFilter = {
    every?: ProcessedDocumentWhereInput;
    some?: ProcessedDocumentWhereInput;
    none?: ProcessedDocumentWhereInput;
  };

  export type ProcessingQueueListRelationFilter = {
    every?: ProcessingQueueWhereInput;
    some?: ProcessingQueueWhereInput;
    none?: ProcessingQueueWhereInput;
  };

  export type ProcessedDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProcessingQueueOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type PaperlessInstanceOwnerIdNameCompoundUniqueInput = {
    ownerId: string;
    name: string;
  };

  export type PaperlessInstanceCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    apiUrl?: SortOrder;
    apiToken?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type PaperlessInstanceMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    apiUrl?: SortOrder;
    apiToken?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type PaperlessInstanceMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    apiUrl?: SortOrder;
    apiToken?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type AiProviderOwnerIdNameCompoundUniqueInput = {
    ownerId: string;
    name: string;
  };

  export type AiProviderCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    apiKey?: SortOrder;
    baseUrl?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type AiProviderMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    apiKey?: SortOrder;
    baseUrl?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type AiProviderMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    apiKey?: SortOrder;
    baseUrl?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type AiBotOwnerIdNameCompoundUniqueInput = {
    ownerId: string;
    name: string;
  };

  export type AiBotCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    systemPrompt?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    aiProviderId?: SortOrder;
  };

  export type AiBotMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    systemPrompt?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    aiProviderId?: SortOrder;
  };

  export type AiBotMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    systemPrompt?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    ownerId?: SortOrder;
    aiProviderId?: SortOrder;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };

  export type ProcessedDocumentPaperlessInstanceIdPaperlessIdCompoundUniqueInput = {
    paperlessInstanceId: string;
    paperlessId: number;
  };

  export type ProcessedDocumentCountOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    title?: SortOrder;
    processedAt?: SortOrder;
    aiProvider?: SortOrder;
    tokensUsed?: SortOrder;
    changes?: SortOrder;
    originalTitle?: SortOrder;
    originalCorrespondent?: SortOrder;
    originalDocumentType?: SortOrder;
    originalTags?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessedDocumentAvgOrderByAggregateInput = {
    paperlessId?: SortOrder;
    tokensUsed?: SortOrder;
  };

  export type ProcessedDocumentMaxOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    title?: SortOrder;
    processedAt?: SortOrder;
    aiProvider?: SortOrder;
    tokensUsed?: SortOrder;
    originalTitle?: SortOrder;
    originalCorrespondent?: SortOrder;
    originalDocumentType?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessedDocumentMinOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    title?: SortOrder;
    processedAt?: SortOrder;
    aiProvider?: SortOrder;
    tokensUsed?: SortOrder;
    originalTitle?: SortOrder;
    originalCorrespondent?: SortOrder;
    originalDocumentType?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessedDocumentSumOrderByAggregateInput = {
    paperlessId?: SortOrder;
    tokensUsed?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type ProcessingQueuePaperlessInstanceIdPaperlessIdCompoundUniqueInput = {
    paperlessInstanceId: string;
    paperlessId: number;
  };

  export type ProcessingQueueCountOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    status?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
    lastError?: SortOrder;
    scheduledFor?: SortOrder;
    startedAt?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessingQueueAvgOrderByAggregateInput = {
    paperlessId?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
  };

  export type ProcessingQueueMaxOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    status?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
    lastError?: SortOrder;
    scheduledFor?: SortOrder;
    startedAt?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessingQueueMinOrderByAggregateInput = {
    id?: SortOrder;
    paperlessId?: SortOrder;
    status?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
    lastError?: SortOrder;
    scheduledFor?: SortOrder;
    startedAt?: SortOrder;
    completedAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    paperlessInstanceId?: SortOrder;
  };

  export type ProcessingQueueSumOrderByAggregateInput = {
    paperlessId?: SortOrder;
    priority?: SortOrder;
    attempts?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type AiBotNullableScalarRelationFilter = {
    is?: AiBotWhereInput | null;
    isNot?: AiBotWhereInput | null;
  };

  export type AiUsageMetricCountOrderByAggregateInput = {
    id?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrder;
    documentId?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
  };

  export type AiUsageMetricAvgOrderByAggregateInput = {
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrder;
    documentId?: SortOrder;
  };

  export type AiUsageMetricMaxOrderByAggregateInput = {
    id?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrder;
    documentId?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
  };

  export type AiUsageMetricMinOrderByAggregateInput = {
    id?: SortOrder;
    provider?: SortOrder;
    model?: SortOrder;
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrder;
    documentId?: SortOrder;
    createdAt?: SortOrder;
    userId?: SortOrder;
    aiBotId?: SortOrder;
  };

  export type AiUsageMetricSumOrderByAggregateInput = {
    promptTokens?: SortOrder;
    completionTokens?: SortOrder;
    totalTokens?: SortOrder;
    estimatedCost?: SortOrder;
    documentId?: SortOrder;
  };

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type PaperlessInstanceCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<
          PaperlessInstanceCreateWithoutOwnerInput,
          PaperlessInstanceUncheckedCreateWithoutOwnerInput
        >
      | PaperlessInstanceCreateWithoutOwnerInput[]
      | PaperlessInstanceUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput[];
    createMany?: PaperlessInstanceCreateManyOwnerInputEnvelope;
    connect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
  };

  export type AiProviderCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>
      | AiProviderCreateWithoutOwnerInput[]
      | AiProviderUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiProviderCreateOrConnectWithoutOwnerInput
      | AiProviderCreateOrConnectWithoutOwnerInput[];
    createMany?: AiProviderCreateManyOwnerInputEnvelope;
    connect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
  };

  export type AiBotCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>
      | AiBotCreateWithoutOwnerInput[]
      | AiBotUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutOwnerInput
      | AiBotCreateOrConnectWithoutOwnerInput[];
    createMany?: AiBotCreateManyOwnerInputEnvelope;
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
  };

  export type UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutUserInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
        >
      | UserPaperlessInstanceAccessCreateWithoutUserInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyUserInputEnvelope;
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
  };

  export type UserAiProviderAccessCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutUserInput,
          UserAiProviderAccessUncheckedCreateWithoutUserInput
        >
      | UserAiProviderAccessCreateWithoutUserInput[]
      | UserAiProviderAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutUserInput
      | UserAiProviderAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserAiProviderAccessCreateManyUserInputEnvelope;
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
  };

  export type UserAiBotAccessCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutUserInput, UserAiBotAccessUncheckedCreateWithoutUserInput>
      | UserAiBotAccessCreateWithoutUserInput[]
      | UserAiBotAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutUserInput
      | UserAiBotAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserAiBotAccessCreateManyUserInputEnvelope;
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
  };

  export type AiUsageMetricCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>
      | AiUsageMetricCreateWithoutUserInput[]
      | AiUsageMetricUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutUserInput
      | AiUsageMetricCreateOrConnectWithoutUserInput[];
    createMany?: AiUsageMetricCreateManyUserInputEnvelope;
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
  };

  export type PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<
          PaperlessInstanceCreateWithoutOwnerInput,
          PaperlessInstanceUncheckedCreateWithoutOwnerInput
        >
      | PaperlessInstanceCreateWithoutOwnerInput[]
      | PaperlessInstanceUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput[];
    createMany?: PaperlessInstanceCreateManyOwnerInputEnvelope;
    connect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
  };

  export type AiProviderUncheckedCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>
      | AiProviderCreateWithoutOwnerInput[]
      | AiProviderUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiProviderCreateOrConnectWithoutOwnerInput
      | AiProviderCreateOrConnectWithoutOwnerInput[];
    createMany?: AiProviderCreateManyOwnerInputEnvelope;
    connect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
  };

  export type AiBotUncheckedCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>
      | AiBotCreateWithoutOwnerInput[]
      | AiBotUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutOwnerInput
      | AiBotCreateOrConnectWithoutOwnerInput[];
    createMany?: AiBotCreateManyOwnerInputEnvelope;
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
  };

  export type UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutUserInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
        >
      | UserPaperlessInstanceAccessCreateWithoutUserInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyUserInputEnvelope;
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
  };

  export type UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutUserInput,
          UserAiProviderAccessUncheckedCreateWithoutUserInput
        >
      | UserAiProviderAccessCreateWithoutUserInput[]
      | UserAiProviderAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutUserInput
      | UserAiProviderAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserAiProviderAccessCreateManyUserInputEnvelope;
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
  };

  export type UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutUserInput, UserAiBotAccessUncheckedCreateWithoutUserInput>
      | UserAiBotAccessCreateWithoutUserInput[]
      | UserAiBotAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutUserInput
      | UserAiBotAccessCreateOrConnectWithoutUserInput[];
    createMany?: UserAiBotAccessCreateManyUserInputEnvelope;
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
  };

  export type AiUsageMetricUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>
      | AiUsageMetricCreateWithoutUserInput[]
      | AiUsageMetricUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutUserInput
      | AiUsageMetricCreateOrConnectWithoutUserInput[];
    createMany?: AiUsageMetricCreateManyUserInputEnvelope;
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
  };

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type PaperlessInstanceUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<
          PaperlessInstanceCreateWithoutOwnerInput,
          PaperlessInstanceUncheckedCreateWithoutOwnerInput
        >
      | PaperlessInstanceCreateWithoutOwnerInput[]
      | PaperlessInstanceUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | PaperlessInstanceUpsertWithWhereUniqueWithoutOwnerInput
      | PaperlessInstanceUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: PaperlessInstanceCreateManyOwnerInputEnvelope;
    set?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    disconnect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    delete?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    connect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    update?:
      | PaperlessInstanceUpdateWithWhereUniqueWithoutOwnerInput
      | PaperlessInstanceUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | PaperlessInstanceUpdateManyWithWhereWithoutOwnerInput
      | PaperlessInstanceUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: PaperlessInstanceScalarWhereInput | PaperlessInstanceScalarWhereInput[];
  };

  export type AiProviderUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>
      | AiProviderCreateWithoutOwnerInput[]
      | AiProviderUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiProviderCreateOrConnectWithoutOwnerInput
      | AiProviderCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | AiProviderUpsertWithWhereUniqueWithoutOwnerInput
      | AiProviderUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: AiProviderCreateManyOwnerInputEnvelope;
    set?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    disconnect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    delete?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    connect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    update?:
      | AiProviderUpdateWithWhereUniqueWithoutOwnerInput
      | AiProviderUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | AiProviderUpdateManyWithWhereWithoutOwnerInput
      | AiProviderUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: AiProviderScalarWhereInput | AiProviderScalarWhereInput[];
  };

  export type AiBotUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>
      | AiBotCreateWithoutOwnerInput[]
      | AiBotUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutOwnerInput
      | AiBotCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | AiBotUpsertWithWhereUniqueWithoutOwnerInput
      | AiBotUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: AiBotCreateManyOwnerInputEnvelope;
    set?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    disconnect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    delete?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    update?:
      | AiBotUpdateWithWhereUniqueWithoutOwnerInput
      | AiBotUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | AiBotUpdateManyWithWhereWithoutOwnerInput
      | AiBotUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
  };

  export type UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutUserInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
        >
      | UserPaperlessInstanceAccessCreateWithoutUserInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutUserInput
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyUserInputEnvelope;
    set?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    disconnect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    delete?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    update?:
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutUserInput
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutUserInput
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
  };

  export type UserAiProviderAccessUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutUserInput,
          UserAiProviderAccessUncheckedCreateWithoutUserInput
        >
      | UserAiProviderAccessCreateWithoutUserInput[]
      | UserAiProviderAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutUserInput
      | UserAiProviderAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutUserInput
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserAiProviderAccessCreateManyUserInputEnvelope;
    set?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    disconnect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    delete?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    update?:
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutUserInput
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserAiProviderAccessUpdateManyWithWhereWithoutUserInput
      | UserAiProviderAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
  };

  export type UserAiBotAccessUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutUserInput, UserAiBotAccessUncheckedCreateWithoutUserInput>
      | UserAiBotAccessCreateWithoutUserInput[]
      | UserAiBotAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutUserInput
      | UserAiBotAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserAiBotAccessUpsertWithWhereUniqueWithoutUserInput
      | UserAiBotAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserAiBotAccessCreateManyUserInputEnvelope;
    set?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    disconnect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    delete?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    update?:
      | UserAiBotAccessUpdateWithWhereUniqueWithoutUserInput
      | UserAiBotAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserAiBotAccessUpdateManyWithWhereWithoutUserInput
      | UserAiBotAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
  };

  export type AiUsageMetricUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>
      | AiUsageMetricCreateWithoutUserInput[]
      | AiUsageMetricUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutUserInput
      | AiUsageMetricCreateOrConnectWithoutUserInput[];
    upsert?:
      | AiUsageMetricUpsertWithWhereUniqueWithoutUserInput
      | AiUsageMetricUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AiUsageMetricCreateManyUserInputEnvelope;
    set?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    disconnect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    delete?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    update?:
      | AiUsageMetricUpdateWithWhereUniqueWithoutUserInput
      | AiUsageMetricUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AiUsageMetricUpdateManyWithWhereWithoutUserInput
      | AiUsageMetricUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
  };

  export type PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<
          PaperlessInstanceCreateWithoutOwnerInput,
          PaperlessInstanceUncheckedCreateWithoutOwnerInput
        >
      | PaperlessInstanceCreateWithoutOwnerInput[]
      | PaperlessInstanceUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput
      | PaperlessInstanceCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | PaperlessInstanceUpsertWithWhereUniqueWithoutOwnerInput
      | PaperlessInstanceUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: PaperlessInstanceCreateManyOwnerInputEnvelope;
    set?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    disconnect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    delete?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    connect?: PaperlessInstanceWhereUniqueInput | PaperlessInstanceWhereUniqueInput[];
    update?:
      | PaperlessInstanceUpdateWithWhereUniqueWithoutOwnerInput
      | PaperlessInstanceUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | PaperlessInstanceUpdateManyWithWhereWithoutOwnerInput
      | PaperlessInstanceUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: PaperlessInstanceScalarWhereInput | PaperlessInstanceScalarWhereInput[];
  };

  export type AiProviderUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>
      | AiProviderCreateWithoutOwnerInput[]
      | AiProviderUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiProviderCreateOrConnectWithoutOwnerInput
      | AiProviderCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | AiProviderUpsertWithWhereUniqueWithoutOwnerInput
      | AiProviderUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: AiProviderCreateManyOwnerInputEnvelope;
    set?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    disconnect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    delete?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    connect?: AiProviderWhereUniqueInput | AiProviderWhereUniqueInput[];
    update?:
      | AiProviderUpdateWithWhereUniqueWithoutOwnerInput
      | AiProviderUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | AiProviderUpdateManyWithWhereWithoutOwnerInput
      | AiProviderUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: AiProviderScalarWhereInput | AiProviderScalarWhereInput[];
  };

  export type AiBotUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>
      | AiBotCreateWithoutOwnerInput[]
      | AiBotUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutOwnerInput
      | AiBotCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | AiBotUpsertWithWhereUniqueWithoutOwnerInput
      | AiBotUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: AiBotCreateManyOwnerInputEnvelope;
    set?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    disconnect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    delete?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    update?:
      | AiBotUpdateWithWhereUniqueWithoutOwnerInput
      | AiBotUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | AiBotUpdateManyWithWhereWithoutOwnerInput
      | AiBotUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutUserInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
        >
      | UserPaperlessInstanceAccessCreateWithoutUserInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutUserInput
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyUserInputEnvelope;
    set?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    disconnect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    delete?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    update?:
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutUserInput
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutUserInput
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
  };

  export type UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutUserInput,
          UserAiProviderAccessUncheckedCreateWithoutUserInput
        >
      | UserAiProviderAccessCreateWithoutUserInput[]
      | UserAiProviderAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutUserInput
      | UserAiProviderAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutUserInput
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserAiProviderAccessCreateManyUserInputEnvelope;
    set?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    disconnect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    delete?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    update?:
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutUserInput
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserAiProviderAccessUpdateManyWithWhereWithoutUserInput
      | UserAiProviderAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
  };

  export type UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutUserInput, UserAiBotAccessUncheckedCreateWithoutUserInput>
      | UserAiBotAccessCreateWithoutUserInput[]
      | UserAiBotAccessUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutUserInput
      | UserAiBotAccessCreateOrConnectWithoutUserInput[];
    upsert?:
      | UserAiBotAccessUpsertWithWhereUniqueWithoutUserInput
      | UserAiBotAccessUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: UserAiBotAccessCreateManyUserInputEnvelope;
    set?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    disconnect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    delete?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    update?:
      | UserAiBotAccessUpdateWithWhereUniqueWithoutUserInput
      | UserAiBotAccessUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | UserAiBotAccessUpdateManyWithWhereWithoutUserInput
      | UserAiBotAccessUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
  };

  export type AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>
      | AiUsageMetricCreateWithoutUserInput[]
      | AiUsageMetricUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutUserInput
      | AiUsageMetricCreateOrConnectWithoutUserInput[];
    upsert?:
      | AiUsageMetricUpsertWithWhereUniqueWithoutUserInput
      | AiUsageMetricUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AiUsageMetricCreateManyUserInputEnvelope;
    set?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    disconnect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    delete?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    update?:
      | AiUsageMetricUpdateWithWhereUniqueWithoutUserInput
      | AiUsageMetricUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AiUsageMetricUpdateManyWithWhereWithoutUserInput
      | AiUsageMetricUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutSharedPaperlessInstancesInput = {
    create?: XOR<
      UserCreateWithoutSharedPaperlessInstancesInput,
      UserUncheckedCreateWithoutSharedPaperlessInstancesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSharedPaperlessInstancesInput;
    connect?: UserWhereUniqueInput;
  };

  export type PaperlessInstanceCreateNestedOneWithoutSharedWithInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutSharedWithInput,
      PaperlessInstanceUncheckedCreateWithoutSharedWithInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutSharedWithInput;
    connect?: PaperlessInstanceWhereUniqueInput;
  };

  export type EnumPermissionFieldUpdateOperationsInput = {
    set?: $Enums.Permission;
  };

  export type UserUpdateOneRequiredWithoutSharedPaperlessInstancesNestedInput = {
    create?: XOR<
      UserCreateWithoutSharedPaperlessInstancesInput,
      UserUncheckedCreateWithoutSharedPaperlessInstancesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSharedPaperlessInstancesInput;
    upsert?: UserUpsertWithoutSharedPaperlessInstancesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutSharedPaperlessInstancesInput,
        UserUpdateWithoutSharedPaperlessInstancesInput
      >,
      UserUncheckedUpdateWithoutSharedPaperlessInstancesInput
    >;
  };

  export type PaperlessInstanceUpdateOneRequiredWithoutSharedWithNestedInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutSharedWithInput,
      PaperlessInstanceUncheckedCreateWithoutSharedWithInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutSharedWithInput;
    upsert?: PaperlessInstanceUpsertWithoutSharedWithInput;
    connect?: PaperlessInstanceWhereUniqueInput;
    update?: XOR<
      XOR<
        PaperlessInstanceUpdateToOneWithWhereWithoutSharedWithInput,
        PaperlessInstanceUpdateWithoutSharedWithInput
      >,
      PaperlessInstanceUncheckedUpdateWithoutSharedWithInput
    >;
  };

  export type UserCreateNestedOneWithoutSharedAiProvidersInput = {
    create?: XOR<
      UserCreateWithoutSharedAiProvidersInput,
      UserUncheckedCreateWithoutSharedAiProvidersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSharedAiProvidersInput;
    connect?: UserWhereUniqueInput;
  };

  export type AiProviderCreateNestedOneWithoutSharedWithInput = {
    create?: XOR<
      AiProviderCreateWithoutSharedWithInput,
      AiProviderUncheckedCreateWithoutSharedWithInput
    >;
    connectOrCreate?: AiProviderCreateOrConnectWithoutSharedWithInput;
    connect?: AiProviderWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutSharedAiProvidersNestedInput = {
    create?: XOR<
      UserCreateWithoutSharedAiProvidersInput,
      UserUncheckedCreateWithoutSharedAiProvidersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSharedAiProvidersInput;
    upsert?: UserUpsertWithoutSharedAiProvidersInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutSharedAiProvidersInput,
        UserUpdateWithoutSharedAiProvidersInput
      >,
      UserUncheckedUpdateWithoutSharedAiProvidersInput
    >;
  };

  export type AiProviderUpdateOneRequiredWithoutSharedWithNestedInput = {
    create?: XOR<
      AiProviderCreateWithoutSharedWithInput,
      AiProviderUncheckedCreateWithoutSharedWithInput
    >;
    connectOrCreate?: AiProviderCreateOrConnectWithoutSharedWithInput;
    upsert?: AiProviderUpsertWithoutSharedWithInput;
    connect?: AiProviderWhereUniqueInput;
    update?: XOR<
      XOR<
        AiProviderUpdateToOneWithWhereWithoutSharedWithInput,
        AiProviderUpdateWithoutSharedWithInput
      >,
      AiProviderUncheckedUpdateWithoutSharedWithInput
    >;
  };

  export type UserCreateNestedOneWithoutSharedAiBotsInput = {
    create?: XOR<UserCreateWithoutSharedAiBotsInput, UserUncheckedCreateWithoutSharedAiBotsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSharedAiBotsInput;
    connect?: UserWhereUniqueInput;
  };

  export type AiBotCreateNestedOneWithoutSharedWithInput = {
    create?: XOR<AiBotCreateWithoutSharedWithInput, AiBotUncheckedCreateWithoutSharedWithInput>;
    connectOrCreate?: AiBotCreateOrConnectWithoutSharedWithInput;
    connect?: AiBotWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutSharedAiBotsNestedInput = {
    create?: XOR<UserCreateWithoutSharedAiBotsInput, UserUncheckedCreateWithoutSharedAiBotsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSharedAiBotsInput;
    upsert?: UserUpsertWithoutSharedAiBotsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutSharedAiBotsInput, UserUpdateWithoutSharedAiBotsInput>,
      UserUncheckedUpdateWithoutSharedAiBotsInput
    >;
  };

  export type AiBotUpdateOneRequiredWithoutSharedWithNestedInput = {
    create?: XOR<AiBotCreateWithoutSharedWithInput, AiBotUncheckedCreateWithoutSharedWithInput>;
    connectOrCreate?: AiBotCreateOrConnectWithoutSharedWithInput;
    upsert?: AiBotUpsertWithoutSharedWithInput;
    connect?: AiBotWhereUniqueInput;
    update?: XOR<
      XOR<AiBotUpdateToOneWithWhereWithoutSharedWithInput, AiBotUpdateWithoutSharedWithInput>,
      AiBotUncheckedUpdateWithoutSharedWithInput
    >;
  };

  export type UserCreateNestedOneWithoutOwnedPaperlessInstancesInput = {
    create?: XOR<
      UserCreateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedCreateWithoutOwnedPaperlessInstancesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedPaperlessInstancesInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserPaperlessInstanceAccessCreateNestedManyWithoutInstanceInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutInstanceInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
        >
      | UserPaperlessInstanceAccessCreateWithoutInstanceInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyInstanceInputEnvelope;
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
  };

  export type ProcessedDocumentCreateNestedManyWithoutPaperlessInstanceInput = {
    create?:
      | XOR<
          ProcessedDocumentCreateWithoutPaperlessInstanceInput,
          ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessedDocumentCreateWithoutPaperlessInstanceInput[]
      | ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput[];
    createMany?: ProcessedDocumentCreateManyPaperlessInstanceInputEnvelope;
    connect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
  };

  export type ProcessingQueueCreateNestedManyWithoutPaperlessInstanceInput = {
    create?:
      | XOR<
          ProcessingQueueCreateWithoutPaperlessInstanceInput,
          ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessingQueueCreateWithoutPaperlessInstanceInput[]
      | ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput[];
    createMany?: ProcessingQueueCreateManyPaperlessInstanceInputEnvelope;
    connect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
  };

  export type UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutInstanceInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutInstanceInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
        >
      | UserPaperlessInstanceAccessCreateWithoutInstanceInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyInstanceInputEnvelope;
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
  };

  export type ProcessedDocumentUncheckedCreateNestedManyWithoutPaperlessInstanceInput = {
    create?:
      | XOR<
          ProcessedDocumentCreateWithoutPaperlessInstanceInput,
          ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessedDocumentCreateWithoutPaperlessInstanceInput[]
      | ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput[];
    createMany?: ProcessedDocumentCreateManyPaperlessInstanceInputEnvelope;
    connect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
  };

  export type ProcessingQueueUncheckedCreateNestedManyWithoutPaperlessInstanceInput = {
    create?:
      | XOR<
          ProcessingQueueCreateWithoutPaperlessInstanceInput,
          ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessingQueueCreateWithoutPaperlessInstanceInput[]
      | ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput[];
    createMany?: ProcessingQueueCreateManyPaperlessInstanceInputEnvelope;
    connect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
  };

  export type UserUpdateOneRequiredWithoutOwnedPaperlessInstancesNestedInput = {
    create?: XOR<
      UserCreateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedCreateWithoutOwnedPaperlessInstancesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedPaperlessInstancesInput;
    upsert?: UserUpsertWithoutOwnedPaperlessInstancesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutOwnedPaperlessInstancesInput,
        UserUpdateWithoutOwnedPaperlessInstancesInput
      >,
      UserUncheckedUpdateWithoutOwnedPaperlessInstancesInput
    >;
  };

  export type UserPaperlessInstanceAccessUpdateManyWithoutInstanceNestedInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutInstanceInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
        >
      | UserPaperlessInstanceAccessCreateWithoutInstanceInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput[];
    upsert?:
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutInstanceInput
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutInstanceInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyInstanceInputEnvelope;
    set?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    disconnect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    delete?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    update?:
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutInstanceInput
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutInstanceInput[];
    updateMany?:
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutInstanceInput
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutInstanceInput[];
    deleteMany?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
  };

  export type ProcessedDocumentUpdateManyWithoutPaperlessInstanceNestedInput = {
    create?:
      | XOR<
          ProcessedDocumentCreateWithoutPaperlessInstanceInput,
          ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessedDocumentCreateWithoutPaperlessInstanceInput[]
      | ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput[];
    upsert?:
      | ProcessedDocumentUpsertWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessedDocumentUpsertWithWhereUniqueWithoutPaperlessInstanceInput[];
    createMany?: ProcessedDocumentCreateManyPaperlessInstanceInputEnvelope;
    set?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    disconnect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    delete?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    connect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    update?:
      | ProcessedDocumentUpdateWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessedDocumentUpdateWithWhereUniqueWithoutPaperlessInstanceInput[];
    updateMany?:
      | ProcessedDocumentUpdateManyWithWhereWithoutPaperlessInstanceInput
      | ProcessedDocumentUpdateManyWithWhereWithoutPaperlessInstanceInput[];
    deleteMany?: ProcessedDocumentScalarWhereInput | ProcessedDocumentScalarWhereInput[];
  };

  export type ProcessingQueueUpdateManyWithoutPaperlessInstanceNestedInput = {
    create?:
      | XOR<
          ProcessingQueueCreateWithoutPaperlessInstanceInput,
          ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessingQueueCreateWithoutPaperlessInstanceInput[]
      | ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput[];
    upsert?:
      | ProcessingQueueUpsertWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessingQueueUpsertWithWhereUniqueWithoutPaperlessInstanceInput[];
    createMany?: ProcessingQueueCreateManyPaperlessInstanceInputEnvelope;
    set?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    disconnect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    delete?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    connect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    update?:
      | ProcessingQueueUpdateWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessingQueueUpdateWithWhereUniqueWithoutPaperlessInstanceInput[];
    updateMany?:
      | ProcessingQueueUpdateManyWithWhereWithoutPaperlessInstanceInput
      | ProcessingQueueUpdateManyWithWhereWithoutPaperlessInstanceInput[];
    deleteMany?: ProcessingQueueScalarWhereInput | ProcessingQueueScalarWhereInput[];
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceNestedInput = {
    create?:
      | XOR<
          UserPaperlessInstanceAccessCreateWithoutInstanceInput,
          UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
        >
      | UserPaperlessInstanceAccessCreateWithoutInstanceInput[]
      | UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput[];
    connectOrCreate?:
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput
      | UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput[];
    upsert?:
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutInstanceInput
      | UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutInstanceInput[];
    createMany?: UserPaperlessInstanceAccessCreateManyInstanceInputEnvelope;
    set?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    disconnect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    delete?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    connect?:
      | UserPaperlessInstanceAccessWhereUniqueInput
      | UserPaperlessInstanceAccessWhereUniqueInput[];
    update?:
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutInstanceInput
      | UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutInstanceInput[];
    updateMany?:
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutInstanceInput
      | UserPaperlessInstanceAccessUpdateManyWithWhereWithoutInstanceInput[];
    deleteMany?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
  };

  export type ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceNestedInput = {
    create?:
      | XOR<
          ProcessedDocumentCreateWithoutPaperlessInstanceInput,
          ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessedDocumentCreateWithoutPaperlessInstanceInput[]
      | ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput[];
    upsert?:
      | ProcessedDocumentUpsertWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessedDocumentUpsertWithWhereUniqueWithoutPaperlessInstanceInput[];
    createMany?: ProcessedDocumentCreateManyPaperlessInstanceInputEnvelope;
    set?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    disconnect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    delete?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    connect?: ProcessedDocumentWhereUniqueInput | ProcessedDocumentWhereUniqueInput[];
    update?:
      | ProcessedDocumentUpdateWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessedDocumentUpdateWithWhereUniqueWithoutPaperlessInstanceInput[];
    updateMany?:
      | ProcessedDocumentUpdateManyWithWhereWithoutPaperlessInstanceInput
      | ProcessedDocumentUpdateManyWithWhereWithoutPaperlessInstanceInput[];
    deleteMany?: ProcessedDocumentScalarWhereInput | ProcessedDocumentScalarWhereInput[];
  };

  export type ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceNestedInput = {
    create?:
      | XOR<
          ProcessingQueueCreateWithoutPaperlessInstanceInput,
          ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
        >
      | ProcessingQueueCreateWithoutPaperlessInstanceInput[]
      | ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput[];
    connectOrCreate?:
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput
      | ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput[];
    upsert?:
      | ProcessingQueueUpsertWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessingQueueUpsertWithWhereUniqueWithoutPaperlessInstanceInput[];
    createMany?: ProcessingQueueCreateManyPaperlessInstanceInputEnvelope;
    set?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    disconnect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    delete?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    connect?: ProcessingQueueWhereUniqueInput | ProcessingQueueWhereUniqueInput[];
    update?:
      | ProcessingQueueUpdateWithWhereUniqueWithoutPaperlessInstanceInput
      | ProcessingQueueUpdateWithWhereUniqueWithoutPaperlessInstanceInput[];
    updateMany?:
      | ProcessingQueueUpdateManyWithWhereWithoutPaperlessInstanceInput
      | ProcessingQueueUpdateManyWithWhereWithoutPaperlessInstanceInput[];
    deleteMany?: ProcessingQueueScalarWhereInput | ProcessingQueueScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutOwnedAiProvidersInput = {
    create?: XOR<
      UserCreateWithoutOwnedAiProvidersInput,
      UserUncheckedCreateWithoutOwnedAiProvidersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedAiProvidersInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserAiProviderAccessCreateNestedManyWithoutAiProviderInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutAiProviderInput,
          UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
        >
      | UserAiProviderAccessCreateWithoutAiProviderInput[]
      | UserAiProviderAccessUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput[];
    createMany?: UserAiProviderAccessCreateManyAiProviderInputEnvelope;
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
  };

  export type AiBotCreateNestedManyWithoutAiProviderInput = {
    create?:
      | XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>
      | AiBotCreateWithoutAiProviderInput[]
      | AiBotUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutAiProviderInput
      | AiBotCreateOrConnectWithoutAiProviderInput[];
    createMany?: AiBotCreateManyAiProviderInputEnvelope;
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
  };

  export type UserAiProviderAccessUncheckedCreateNestedManyWithoutAiProviderInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutAiProviderInput,
          UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
        >
      | UserAiProviderAccessCreateWithoutAiProviderInput[]
      | UserAiProviderAccessUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput[];
    createMany?: UserAiProviderAccessCreateManyAiProviderInputEnvelope;
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
  };

  export type AiBotUncheckedCreateNestedManyWithoutAiProviderInput = {
    create?:
      | XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>
      | AiBotCreateWithoutAiProviderInput[]
      | AiBotUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutAiProviderInput
      | AiBotCreateOrConnectWithoutAiProviderInput[];
    createMany?: AiBotCreateManyAiProviderInputEnvelope;
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type UserUpdateOneRequiredWithoutOwnedAiProvidersNestedInput = {
    create?: XOR<
      UserCreateWithoutOwnedAiProvidersInput,
      UserUncheckedCreateWithoutOwnedAiProvidersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedAiProvidersInput;
    upsert?: UserUpsertWithoutOwnedAiProvidersInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutOwnedAiProvidersInput,
        UserUpdateWithoutOwnedAiProvidersInput
      >,
      UserUncheckedUpdateWithoutOwnedAiProvidersInput
    >;
  };

  export type UserAiProviderAccessUpdateManyWithoutAiProviderNestedInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutAiProviderInput,
          UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
        >
      | UserAiProviderAccessCreateWithoutAiProviderInput[]
      | UserAiProviderAccessUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput[];
    upsert?:
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutAiProviderInput
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutAiProviderInput[];
    createMany?: UserAiProviderAccessCreateManyAiProviderInputEnvelope;
    set?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    disconnect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    delete?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    update?:
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutAiProviderInput
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutAiProviderInput[];
    updateMany?:
      | UserAiProviderAccessUpdateManyWithWhereWithoutAiProviderInput
      | UserAiProviderAccessUpdateManyWithWhereWithoutAiProviderInput[];
    deleteMany?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
  };

  export type AiBotUpdateManyWithoutAiProviderNestedInput = {
    create?:
      | XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>
      | AiBotCreateWithoutAiProviderInput[]
      | AiBotUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutAiProviderInput
      | AiBotCreateOrConnectWithoutAiProviderInput[];
    upsert?:
      | AiBotUpsertWithWhereUniqueWithoutAiProviderInput
      | AiBotUpsertWithWhereUniqueWithoutAiProviderInput[];
    createMany?: AiBotCreateManyAiProviderInputEnvelope;
    set?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    disconnect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    delete?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    update?:
      | AiBotUpdateWithWhereUniqueWithoutAiProviderInput
      | AiBotUpdateWithWhereUniqueWithoutAiProviderInput[];
    updateMany?:
      | AiBotUpdateManyWithWhereWithoutAiProviderInput
      | AiBotUpdateManyWithWhereWithoutAiProviderInput[];
    deleteMany?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
  };

  export type UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderNestedInput = {
    create?:
      | XOR<
          UserAiProviderAccessCreateWithoutAiProviderInput,
          UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
        >
      | UserAiProviderAccessCreateWithoutAiProviderInput[]
      | UserAiProviderAccessUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput
      | UserAiProviderAccessCreateOrConnectWithoutAiProviderInput[];
    upsert?:
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutAiProviderInput
      | UserAiProviderAccessUpsertWithWhereUniqueWithoutAiProviderInput[];
    createMany?: UserAiProviderAccessCreateManyAiProviderInputEnvelope;
    set?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    disconnect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    delete?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    connect?: UserAiProviderAccessWhereUniqueInput | UserAiProviderAccessWhereUniqueInput[];
    update?:
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutAiProviderInput
      | UserAiProviderAccessUpdateWithWhereUniqueWithoutAiProviderInput[];
    updateMany?:
      | UserAiProviderAccessUpdateManyWithWhereWithoutAiProviderInput
      | UserAiProviderAccessUpdateManyWithWhereWithoutAiProviderInput[];
    deleteMany?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
  };

  export type AiBotUncheckedUpdateManyWithoutAiProviderNestedInput = {
    create?:
      | XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>
      | AiBotCreateWithoutAiProviderInput[]
      | AiBotUncheckedCreateWithoutAiProviderInput[];
    connectOrCreate?:
      | AiBotCreateOrConnectWithoutAiProviderInput
      | AiBotCreateOrConnectWithoutAiProviderInput[];
    upsert?:
      | AiBotUpsertWithWhereUniqueWithoutAiProviderInput
      | AiBotUpsertWithWhereUniqueWithoutAiProviderInput[];
    createMany?: AiBotCreateManyAiProviderInputEnvelope;
    set?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    disconnect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    delete?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    connect?: AiBotWhereUniqueInput | AiBotWhereUniqueInput[];
    update?:
      | AiBotUpdateWithWhereUniqueWithoutAiProviderInput
      | AiBotUpdateWithWhereUniqueWithoutAiProviderInput[];
    updateMany?:
      | AiBotUpdateManyWithWhereWithoutAiProviderInput
      | AiBotUpdateManyWithWhereWithoutAiProviderInput[];
    deleteMany?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutOwnedAiBotsInput = {
    create?: XOR<UserCreateWithoutOwnedAiBotsInput, UserUncheckedCreateWithoutOwnedAiBotsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedAiBotsInput;
    connect?: UserWhereUniqueInput;
  };

  export type AiProviderCreateNestedOneWithoutBotsInput = {
    create?: XOR<AiProviderCreateWithoutBotsInput, AiProviderUncheckedCreateWithoutBotsInput>;
    connectOrCreate?: AiProviderCreateOrConnectWithoutBotsInput;
    connect?: AiProviderWhereUniqueInput;
  };

  export type UserAiBotAccessCreateNestedManyWithoutAiBotInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutAiBotInput, UserAiBotAccessUncheckedCreateWithoutAiBotInput>
      | UserAiBotAccessCreateWithoutAiBotInput[]
      | UserAiBotAccessUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput[];
    createMany?: UserAiBotAccessCreateManyAiBotInputEnvelope;
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
  };

  export type AiUsageMetricCreateNestedManyWithoutAiBotInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutAiBotInput, AiUsageMetricUncheckedCreateWithoutAiBotInput>
      | AiUsageMetricCreateWithoutAiBotInput[]
      | AiUsageMetricUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutAiBotInput
      | AiUsageMetricCreateOrConnectWithoutAiBotInput[];
    createMany?: AiUsageMetricCreateManyAiBotInputEnvelope;
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
  };

  export type UserAiBotAccessUncheckedCreateNestedManyWithoutAiBotInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutAiBotInput, UserAiBotAccessUncheckedCreateWithoutAiBotInput>
      | UserAiBotAccessCreateWithoutAiBotInput[]
      | UserAiBotAccessUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput[];
    createMany?: UserAiBotAccessCreateManyAiBotInputEnvelope;
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
  };

  export type AiUsageMetricUncheckedCreateNestedManyWithoutAiBotInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutAiBotInput, AiUsageMetricUncheckedCreateWithoutAiBotInput>
      | AiUsageMetricCreateWithoutAiBotInput[]
      | AiUsageMetricUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutAiBotInput
      | AiUsageMetricCreateOrConnectWithoutAiBotInput[];
    createMany?: AiUsageMetricCreateManyAiBotInputEnvelope;
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
  };

  export type UserUpdateOneRequiredWithoutOwnedAiBotsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedAiBotsInput, UserUncheckedCreateWithoutOwnedAiBotsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedAiBotsInput;
    upsert?: UserUpsertWithoutOwnedAiBotsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutOwnedAiBotsInput, UserUpdateWithoutOwnedAiBotsInput>,
      UserUncheckedUpdateWithoutOwnedAiBotsInput
    >;
  };

  export type AiProviderUpdateOneRequiredWithoutBotsNestedInput = {
    create?: XOR<AiProviderCreateWithoutBotsInput, AiProviderUncheckedCreateWithoutBotsInput>;
    connectOrCreate?: AiProviderCreateOrConnectWithoutBotsInput;
    upsert?: AiProviderUpsertWithoutBotsInput;
    connect?: AiProviderWhereUniqueInput;
    update?: XOR<
      XOR<AiProviderUpdateToOneWithWhereWithoutBotsInput, AiProviderUpdateWithoutBotsInput>,
      AiProviderUncheckedUpdateWithoutBotsInput
    >;
  };

  export type UserAiBotAccessUpdateManyWithoutAiBotNestedInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutAiBotInput, UserAiBotAccessUncheckedCreateWithoutAiBotInput>
      | UserAiBotAccessCreateWithoutAiBotInput[]
      | UserAiBotAccessUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput[];
    upsert?:
      | UserAiBotAccessUpsertWithWhereUniqueWithoutAiBotInput
      | UserAiBotAccessUpsertWithWhereUniqueWithoutAiBotInput[];
    createMany?: UserAiBotAccessCreateManyAiBotInputEnvelope;
    set?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    disconnect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    delete?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    update?:
      | UserAiBotAccessUpdateWithWhereUniqueWithoutAiBotInput
      | UserAiBotAccessUpdateWithWhereUniqueWithoutAiBotInput[];
    updateMany?:
      | UserAiBotAccessUpdateManyWithWhereWithoutAiBotInput
      | UserAiBotAccessUpdateManyWithWhereWithoutAiBotInput[];
    deleteMany?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
  };

  export type AiUsageMetricUpdateManyWithoutAiBotNestedInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutAiBotInput, AiUsageMetricUncheckedCreateWithoutAiBotInput>
      | AiUsageMetricCreateWithoutAiBotInput[]
      | AiUsageMetricUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutAiBotInput
      | AiUsageMetricCreateOrConnectWithoutAiBotInput[];
    upsert?:
      | AiUsageMetricUpsertWithWhereUniqueWithoutAiBotInput
      | AiUsageMetricUpsertWithWhereUniqueWithoutAiBotInput[];
    createMany?: AiUsageMetricCreateManyAiBotInputEnvelope;
    set?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    disconnect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    delete?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    update?:
      | AiUsageMetricUpdateWithWhereUniqueWithoutAiBotInput
      | AiUsageMetricUpdateWithWhereUniqueWithoutAiBotInput[];
    updateMany?:
      | AiUsageMetricUpdateManyWithWhereWithoutAiBotInput
      | AiUsageMetricUpdateManyWithWhereWithoutAiBotInput[];
    deleteMany?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
  };

  export type UserAiBotAccessUncheckedUpdateManyWithoutAiBotNestedInput = {
    create?:
      | XOR<UserAiBotAccessCreateWithoutAiBotInput, UserAiBotAccessUncheckedCreateWithoutAiBotInput>
      | UserAiBotAccessCreateWithoutAiBotInput[]
      | UserAiBotAccessUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput
      | UserAiBotAccessCreateOrConnectWithoutAiBotInput[];
    upsert?:
      | UserAiBotAccessUpsertWithWhereUniqueWithoutAiBotInput
      | UserAiBotAccessUpsertWithWhereUniqueWithoutAiBotInput[];
    createMany?: UserAiBotAccessCreateManyAiBotInputEnvelope;
    set?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    disconnect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    delete?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    connect?: UserAiBotAccessWhereUniqueInput | UserAiBotAccessWhereUniqueInput[];
    update?:
      | UserAiBotAccessUpdateWithWhereUniqueWithoutAiBotInput
      | UserAiBotAccessUpdateWithWhereUniqueWithoutAiBotInput[];
    updateMany?:
      | UserAiBotAccessUpdateManyWithWhereWithoutAiBotInput
      | UserAiBotAccessUpdateManyWithWhereWithoutAiBotInput[];
    deleteMany?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
  };

  export type AiUsageMetricUncheckedUpdateManyWithoutAiBotNestedInput = {
    create?:
      | XOR<AiUsageMetricCreateWithoutAiBotInput, AiUsageMetricUncheckedCreateWithoutAiBotInput>
      | AiUsageMetricCreateWithoutAiBotInput[]
      | AiUsageMetricUncheckedCreateWithoutAiBotInput[];
    connectOrCreate?:
      | AiUsageMetricCreateOrConnectWithoutAiBotInput
      | AiUsageMetricCreateOrConnectWithoutAiBotInput[];
    upsert?:
      | AiUsageMetricUpsertWithWhereUniqueWithoutAiBotInput
      | AiUsageMetricUpsertWithWhereUniqueWithoutAiBotInput[];
    createMany?: AiUsageMetricCreateManyAiBotInputEnvelope;
    set?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    disconnect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    delete?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    connect?: AiUsageMetricWhereUniqueInput | AiUsageMetricWhereUniqueInput[];
    update?:
      | AiUsageMetricUpdateWithWhereUniqueWithoutAiBotInput
      | AiUsageMetricUpdateWithWhereUniqueWithoutAiBotInput[];
    updateMany?:
      | AiUsageMetricUpdateManyWithWhereWithoutAiBotInput
      | AiUsageMetricUpdateManyWithWhereWithoutAiBotInput[];
    deleteMany?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
  };

  export type ProcessedDocumentCreateoriginalTagsInput = {
    set: string[];
  };

  export type PaperlessInstanceCreateNestedOneWithoutProcessedDocumentsInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedCreateWithoutProcessedDocumentsInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutProcessedDocumentsInput;
    connect?: PaperlessInstanceWhereUniqueInput;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type ProcessedDocumentUpdateoriginalTagsInput = {
    set?: string[];
    push?: string | string[];
  };

  export type PaperlessInstanceUpdateOneRequiredWithoutProcessedDocumentsNestedInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedCreateWithoutProcessedDocumentsInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutProcessedDocumentsInput;
    upsert?: PaperlessInstanceUpsertWithoutProcessedDocumentsInput;
    connect?: PaperlessInstanceWhereUniqueInput;
    update?: XOR<
      XOR<
        PaperlessInstanceUpdateToOneWithWhereWithoutProcessedDocumentsInput,
        PaperlessInstanceUpdateWithoutProcessedDocumentsInput
      >,
      PaperlessInstanceUncheckedUpdateWithoutProcessedDocumentsInput
    >;
  };

  export type PaperlessInstanceCreateNestedOneWithoutProcessingQueueInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedCreateWithoutProcessingQueueInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutProcessingQueueInput;
    connect?: PaperlessInstanceWhereUniqueInput;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type PaperlessInstanceUpdateOneRequiredWithoutProcessingQueueNestedInput = {
    create?: XOR<
      PaperlessInstanceCreateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedCreateWithoutProcessingQueueInput
    >;
    connectOrCreate?: PaperlessInstanceCreateOrConnectWithoutProcessingQueueInput;
    upsert?: PaperlessInstanceUpsertWithoutProcessingQueueInput;
    connect?: PaperlessInstanceWhereUniqueInput;
    update?: XOR<
      XOR<
        PaperlessInstanceUpdateToOneWithWhereWithoutProcessingQueueInput,
        PaperlessInstanceUpdateWithoutProcessingQueueInput
      >,
      PaperlessInstanceUncheckedUpdateWithoutProcessingQueueInput
    >;
  };

  export type UserCreateNestedOneWithoutAiUsageMetricsInput = {
    create?: XOR<
      UserCreateWithoutAiUsageMetricsInput,
      UserUncheckedCreateWithoutAiUsageMetricsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAiUsageMetricsInput;
    connect?: UserWhereUniqueInput;
  };

  export type AiBotCreateNestedOneWithoutAiUsageMetricsInput = {
    create?: XOR<
      AiBotCreateWithoutAiUsageMetricsInput,
      AiBotUncheckedCreateWithoutAiUsageMetricsInput
    >;
    connectOrCreate?: AiBotCreateOrConnectWithoutAiUsageMetricsInput;
    connect?: AiBotWhereUniqueInput;
  };

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type UserUpdateOneRequiredWithoutAiUsageMetricsNestedInput = {
    create?: XOR<
      UserCreateWithoutAiUsageMetricsInput,
      UserUncheckedCreateWithoutAiUsageMetricsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAiUsageMetricsInput;
    upsert?: UserUpsertWithoutAiUsageMetricsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutAiUsageMetricsInput, UserUpdateWithoutAiUsageMetricsInput>,
      UserUncheckedUpdateWithoutAiUsageMetricsInput
    >;
  };

  export type AiBotUpdateOneWithoutAiUsageMetricsNestedInput = {
    create?: XOR<
      AiBotCreateWithoutAiUsageMetricsInput,
      AiBotUncheckedCreateWithoutAiUsageMetricsInput
    >;
    connectOrCreate?: AiBotCreateOrConnectWithoutAiUsageMetricsInput;
    upsert?: AiBotUpsertWithoutAiUsageMetricsInput;
    disconnect?: AiBotWhereInput | boolean;
    delete?: AiBotWhereInput | boolean;
    connect?: AiBotWhereUniqueInput;
    update?: XOR<
      XOR<
        AiBotUpdateToOneWithWhereWithoutAiUsageMetricsInput,
        AiBotUpdateWithoutAiUsageMetricsInput
      >,
      AiBotUncheckedUpdateWithoutAiUsageMetricsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedEnumPermissionFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel>;
    in?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    not?: NestedEnumPermissionFilter<$PrismaModel> | $Enums.Permission;
  };

  export type NestedEnumPermissionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Permission | EnumPermissionFieldRefInput<$PrismaModel>;
    in?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Permission[] | ListEnumPermissionFieldRefInput<$PrismaModel>;
    not?: NestedEnumPermissionWithAggregatesFilter<$PrismaModel> | $Enums.Permission;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPermissionFilter<$PrismaModel>;
    _max?: NestedEnumPermissionFilter<$PrismaModel>;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type PaperlessInstanceCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sharedWith?: UserPaperlessInstanceAccessCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUncheckedCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceCreateOrConnectWithoutOwnerInput = {
    where: PaperlessInstanceWhereUniqueInput;
    create: XOR<
      PaperlessInstanceCreateWithoutOwnerInput,
      PaperlessInstanceUncheckedCreateWithoutOwnerInput
    >;
  };

  export type PaperlessInstanceCreateManyOwnerInputEnvelope = {
    data: PaperlessInstanceCreateManyOwnerInput | PaperlessInstanceCreateManyOwnerInput[];
    skipDuplicates?: boolean;
  };

  export type AiProviderCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sharedWith?: UserAiProviderAccessCreateNestedManyWithoutAiProviderInput;
    bots?: AiBotCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderUncheckedCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sharedWith?: UserAiProviderAccessUncheckedCreateNestedManyWithoutAiProviderInput;
    bots?: AiBotUncheckedCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderCreateOrConnectWithoutOwnerInput = {
    where: AiProviderWhereUniqueInput;
    create: XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>;
  };

  export type AiProviderCreateManyOwnerInputEnvelope = {
    data: AiProviderCreateManyOwnerInput | AiProviderCreateManyOwnerInput[];
    skipDuplicates?: boolean;
  };

  export type AiBotCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    aiProvider: AiProviderCreateNestedOneWithoutBotsInput;
    sharedWith?: UserAiBotAccessCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUncheckedCreateWithoutOwnerInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    aiProviderId: string;
    sharedWith?: UserAiBotAccessUncheckedCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotCreateOrConnectWithoutOwnerInput = {
    where: AiBotWhereUniqueInput;
    create: XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>;
  };

  export type AiBotCreateManyOwnerInputEnvelope = {
    data: AiBotCreateManyOwnerInput | AiBotCreateManyOwnerInput[];
    skipDuplicates?: boolean;
  };

  export type UserPaperlessInstanceAccessCreateWithoutUserInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    instance: PaperlessInstanceCreateNestedOneWithoutSharedWithInput;
  };

  export type UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput = {
    id?: string;
    instanceId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserPaperlessInstanceAccessCreateOrConnectWithoutUserInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    create: XOR<
      UserPaperlessInstanceAccessCreateWithoutUserInput,
      UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserPaperlessInstanceAccessCreateManyUserInputEnvelope = {
    data:
      | UserPaperlessInstanceAccessCreateManyUserInput
      | UserPaperlessInstanceAccessCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type UserAiProviderAccessCreateWithoutUserInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    aiProvider: AiProviderCreateNestedOneWithoutSharedWithInput;
  };

  export type UserAiProviderAccessUncheckedCreateWithoutUserInput = {
    id?: string;
    aiProviderId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiProviderAccessCreateOrConnectWithoutUserInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    create: XOR<
      UserAiProviderAccessCreateWithoutUserInput,
      UserAiProviderAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserAiProviderAccessCreateManyUserInputEnvelope = {
    data: UserAiProviderAccessCreateManyUserInput | UserAiProviderAccessCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type UserAiBotAccessCreateWithoutUserInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    aiBot: AiBotCreateNestedOneWithoutSharedWithInput;
  };

  export type UserAiBotAccessUncheckedCreateWithoutUserInput = {
    id?: string;
    aiBotId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiBotAccessCreateOrConnectWithoutUserInput = {
    where: UserAiBotAccessWhereUniqueInput;
    create: XOR<
      UserAiBotAccessCreateWithoutUserInput,
      UserAiBotAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserAiBotAccessCreateManyUserInputEnvelope = {
    data: UserAiBotAccessCreateManyUserInput | UserAiBotAccessCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type AiUsageMetricCreateWithoutUserInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    aiBot?: AiBotCreateNestedOneWithoutAiUsageMetricsInput;
  };

  export type AiUsageMetricUncheckedCreateWithoutUserInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    aiBotId?: string | null;
  };

  export type AiUsageMetricCreateOrConnectWithoutUserInput = {
    where: AiUsageMetricWhereUniqueInput;
    create: XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>;
  };

  export type AiUsageMetricCreateManyUserInputEnvelope = {
    data: AiUsageMetricCreateManyUserInput | AiUsageMetricCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type PaperlessInstanceUpsertWithWhereUniqueWithoutOwnerInput = {
    where: PaperlessInstanceWhereUniqueInput;
    update: XOR<
      PaperlessInstanceUpdateWithoutOwnerInput,
      PaperlessInstanceUncheckedUpdateWithoutOwnerInput
    >;
    create: XOR<
      PaperlessInstanceCreateWithoutOwnerInput,
      PaperlessInstanceUncheckedCreateWithoutOwnerInput
    >;
  };

  export type PaperlessInstanceUpdateWithWhereUniqueWithoutOwnerInput = {
    where: PaperlessInstanceWhereUniqueInput;
    data: XOR<
      PaperlessInstanceUpdateWithoutOwnerInput,
      PaperlessInstanceUncheckedUpdateWithoutOwnerInput
    >;
  };

  export type PaperlessInstanceUpdateManyWithWhereWithoutOwnerInput = {
    where: PaperlessInstanceScalarWhereInput;
    data: XOR<
      PaperlessInstanceUpdateManyMutationInput,
      PaperlessInstanceUncheckedUpdateManyWithoutOwnerInput
    >;
  };

  export type PaperlessInstanceScalarWhereInput = {
    AND?: PaperlessInstanceScalarWhereInput | PaperlessInstanceScalarWhereInput[];
    OR?: PaperlessInstanceScalarWhereInput[];
    NOT?: PaperlessInstanceScalarWhereInput | PaperlessInstanceScalarWhereInput[];
    id?: StringFilter<'PaperlessInstance'> | string;
    name?: StringFilter<'PaperlessInstance'> | string;
    apiUrl?: StringFilter<'PaperlessInstance'> | string;
    apiToken?: StringFilter<'PaperlessInstance'> | string;
    isActive?: BoolFilter<'PaperlessInstance'> | boolean;
    createdAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
    updatedAt?: DateTimeFilter<'PaperlessInstance'> | Date | string;
    ownerId?: StringFilter<'PaperlessInstance'> | string;
  };

  export type AiProviderUpsertWithWhereUniqueWithoutOwnerInput = {
    where: AiProviderWhereUniqueInput;
    update: XOR<AiProviderUpdateWithoutOwnerInput, AiProviderUncheckedUpdateWithoutOwnerInput>;
    create: XOR<AiProviderCreateWithoutOwnerInput, AiProviderUncheckedCreateWithoutOwnerInput>;
  };

  export type AiProviderUpdateWithWhereUniqueWithoutOwnerInput = {
    where: AiProviderWhereUniqueInput;
    data: XOR<AiProviderUpdateWithoutOwnerInput, AiProviderUncheckedUpdateWithoutOwnerInput>;
  };

  export type AiProviderUpdateManyWithWhereWithoutOwnerInput = {
    where: AiProviderScalarWhereInput;
    data: XOR<AiProviderUpdateManyMutationInput, AiProviderUncheckedUpdateManyWithoutOwnerInput>;
  };

  export type AiProviderScalarWhereInput = {
    AND?: AiProviderScalarWhereInput | AiProviderScalarWhereInput[];
    OR?: AiProviderScalarWhereInput[];
    NOT?: AiProviderScalarWhereInput | AiProviderScalarWhereInput[];
    id?: StringFilter<'AiProvider'> | string;
    name?: StringFilter<'AiProvider'> | string;
    provider?: StringFilter<'AiProvider'> | string;
    model?: StringFilter<'AiProvider'> | string;
    apiKey?: StringFilter<'AiProvider'> | string;
    baseUrl?: StringNullableFilter<'AiProvider'> | string | null;
    isActive?: BoolFilter<'AiProvider'> | boolean;
    createdAt?: DateTimeFilter<'AiProvider'> | Date | string;
    updatedAt?: DateTimeFilter<'AiProvider'> | Date | string;
    ownerId?: StringFilter<'AiProvider'> | string;
  };

  export type AiBotUpsertWithWhereUniqueWithoutOwnerInput = {
    where: AiBotWhereUniqueInput;
    update: XOR<AiBotUpdateWithoutOwnerInput, AiBotUncheckedUpdateWithoutOwnerInput>;
    create: XOR<AiBotCreateWithoutOwnerInput, AiBotUncheckedCreateWithoutOwnerInput>;
  };

  export type AiBotUpdateWithWhereUniqueWithoutOwnerInput = {
    where: AiBotWhereUniqueInput;
    data: XOR<AiBotUpdateWithoutOwnerInput, AiBotUncheckedUpdateWithoutOwnerInput>;
  };

  export type AiBotUpdateManyWithWhereWithoutOwnerInput = {
    where: AiBotScalarWhereInput;
    data: XOR<AiBotUpdateManyMutationInput, AiBotUncheckedUpdateManyWithoutOwnerInput>;
  };

  export type AiBotScalarWhereInput = {
    AND?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
    OR?: AiBotScalarWhereInput[];
    NOT?: AiBotScalarWhereInput | AiBotScalarWhereInput[];
    id?: StringFilter<'AiBot'> | string;
    name?: StringFilter<'AiBot'> | string;
    systemPrompt?: StringFilter<'AiBot'> | string;
    isActive?: BoolFilter<'AiBot'> | boolean;
    createdAt?: DateTimeFilter<'AiBot'> | Date | string;
    updatedAt?: DateTimeFilter<'AiBot'> | Date | string;
    ownerId?: StringFilter<'AiBot'> | string;
    aiProviderId?: StringFilter<'AiBot'> | string;
  };

  export type UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    update: XOR<
      UserPaperlessInstanceAccessUpdateWithoutUserInput,
      UserPaperlessInstanceAccessUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      UserPaperlessInstanceAccessCreateWithoutUserInput,
      UserPaperlessInstanceAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    data: XOR<
      UserPaperlessInstanceAccessUpdateWithoutUserInput,
      UserPaperlessInstanceAccessUncheckedUpdateWithoutUserInput
    >;
  };

  export type UserPaperlessInstanceAccessUpdateManyWithWhereWithoutUserInput = {
    where: UserPaperlessInstanceAccessScalarWhereInput;
    data: XOR<
      UserPaperlessInstanceAccessUpdateManyMutationInput,
      UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type UserPaperlessInstanceAccessScalarWhereInput = {
    AND?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
    OR?: UserPaperlessInstanceAccessScalarWhereInput[];
    NOT?:
      | UserPaperlessInstanceAccessScalarWhereInput
      | UserPaperlessInstanceAccessScalarWhereInput[];
    id?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    userId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    instanceId?: StringFilter<'UserPaperlessInstanceAccess'> | string;
    permission?: EnumPermissionFilter<'UserPaperlessInstanceAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserPaperlessInstanceAccess'> | Date | string;
  };

  export type UserAiProviderAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    update: XOR<
      UserAiProviderAccessUpdateWithoutUserInput,
      UserAiProviderAccessUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      UserAiProviderAccessCreateWithoutUserInput,
      UserAiProviderAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserAiProviderAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    data: XOR<
      UserAiProviderAccessUpdateWithoutUserInput,
      UserAiProviderAccessUncheckedUpdateWithoutUserInput
    >;
  };

  export type UserAiProviderAccessUpdateManyWithWhereWithoutUserInput = {
    where: UserAiProviderAccessScalarWhereInput;
    data: XOR<
      UserAiProviderAccessUpdateManyMutationInput,
      UserAiProviderAccessUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type UserAiProviderAccessScalarWhereInput = {
    AND?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
    OR?: UserAiProviderAccessScalarWhereInput[];
    NOT?: UserAiProviderAccessScalarWhereInput | UserAiProviderAccessScalarWhereInput[];
    id?: StringFilter<'UserAiProviderAccess'> | string;
    userId?: StringFilter<'UserAiProviderAccess'> | string;
    aiProviderId?: StringFilter<'UserAiProviderAccess'> | string;
    permission?: EnumPermissionFilter<'UserAiProviderAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserAiProviderAccess'> | Date | string;
  };

  export type UserAiBotAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAiBotAccessWhereUniqueInput;
    update: XOR<
      UserAiBotAccessUpdateWithoutUserInput,
      UserAiBotAccessUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      UserAiBotAccessCreateWithoutUserInput,
      UserAiBotAccessUncheckedCreateWithoutUserInput
    >;
  };

  export type UserAiBotAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAiBotAccessWhereUniqueInput;
    data: XOR<
      UserAiBotAccessUpdateWithoutUserInput,
      UserAiBotAccessUncheckedUpdateWithoutUserInput
    >;
  };

  export type UserAiBotAccessUpdateManyWithWhereWithoutUserInput = {
    where: UserAiBotAccessScalarWhereInput;
    data: XOR<
      UserAiBotAccessUpdateManyMutationInput,
      UserAiBotAccessUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type UserAiBotAccessScalarWhereInput = {
    AND?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
    OR?: UserAiBotAccessScalarWhereInput[];
    NOT?: UserAiBotAccessScalarWhereInput | UserAiBotAccessScalarWhereInput[];
    id?: StringFilter<'UserAiBotAccess'> | string;
    userId?: StringFilter<'UserAiBotAccess'> | string;
    aiBotId?: StringFilter<'UserAiBotAccess'> | string;
    permission?: EnumPermissionFilter<'UserAiBotAccess'> | $Enums.Permission;
    createdAt?: DateTimeFilter<'UserAiBotAccess'> | Date | string;
  };

  export type AiUsageMetricUpsertWithWhereUniqueWithoutUserInput = {
    where: AiUsageMetricWhereUniqueInput;
    update: XOR<AiUsageMetricUpdateWithoutUserInput, AiUsageMetricUncheckedUpdateWithoutUserInput>;
    create: XOR<AiUsageMetricCreateWithoutUserInput, AiUsageMetricUncheckedCreateWithoutUserInput>;
  };

  export type AiUsageMetricUpdateWithWhereUniqueWithoutUserInput = {
    where: AiUsageMetricWhereUniqueInput;
    data: XOR<AiUsageMetricUpdateWithoutUserInput, AiUsageMetricUncheckedUpdateWithoutUserInput>;
  };

  export type AiUsageMetricUpdateManyWithWhereWithoutUserInput = {
    where: AiUsageMetricScalarWhereInput;
    data: XOR<
      AiUsageMetricUpdateManyMutationInput,
      AiUsageMetricUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type AiUsageMetricScalarWhereInput = {
    AND?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
    OR?: AiUsageMetricScalarWhereInput[];
    NOT?: AiUsageMetricScalarWhereInput | AiUsageMetricScalarWhereInput[];
    id?: StringFilter<'AiUsageMetric'> | string;
    provider?: StringFilter<'AiUsageMetric'> | string;
    model?: StringFilter<'AiUsageMetric'> | string;
    promptTokens?: IntFilter<'AiUsageMetric'> | number;
    completionTokens?: IntFilter<'AiUsageMetric'> | number;
    totalTokens?: IntFilter<'AiUsageMetric'> | number;
    estimatedCost?: FloatNullableFilter<'AiUsageMetric'> | number | null;
    documentId?: IntNullableFilter<'AiUsageMetric'> | number | null;
    createdAt?: DateTimeFilter<'AiUsageMetric'> | Date | string;
    userId?: StringFilter<'AiUsageMetric'> | string;
    aiBotId?: StringNullableFilter<'AiUsageMetric'> | string | null;
  };

  export type UserCreateWithoutSharedPaperlessInstancesInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutSharedPaperlessInstancesInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutSharedPaperlessInstancesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutSharedPaperlessInstancesInput,
      UserUncheckedCreateWithoutSharedPaperlessInstancesInput
    >;
  };

  export type PaperlessInstanceCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedPaperlessInstancesInput;
    processedDocuments?: ProcessedDocumentCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUncheckedCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    processedDocuments?: ProcessedDocumentUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
    processingQueue?: ProcessingQueueUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceCreateOrConnectWithoutSharedWithInput = {
    where: PaperlessInstanceWhereUniqueInput;
    create: XOR<
      PaperlessInstanceCreateWithoutSharedWithInput,
      PaperlessInstanceUncheckedCreateWithoutSharedWithInput
    >;
  };

  export type UserUpsertWithoutSharedPaperlessInstancesInput = {
    update: XOR<
      UserUpdateWithoutSharedPaperlessInstancesInput,
      UserUncheckedUpdateWithoutSharedPaperlessInstancesInput
    >;
    create: XOR<
      UserCreateWithoutSharedPaperlessInstancesInput,
      UserUncheckedCreateWithoutSharedPaperlessInstancesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSharedPaperlessInstancesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutSharedPaperlessInstancesInput,
      UserUncheckedUpdateWithoutSharedPaperlessInstancesInput
    >;
  };

  export type UserUpdateWithoutSharedPaperlessInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutSharedPaperlessInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type PaperlessInstanceUpsertWithoutSharedWithInput = {
    update: XOR<
      PaperlessInstanceUpdateWithoutSharedWithInput,
      PaperlessInstanceUncheckedUpdateWithoutSharedWithInput
    >;
    create: XOR<
      PaperlessInstanceCreateWithoutSharedWithInput,
      PaperlessInstanceUncheckedCreateWithoutSharedWithInput
    >;
    where?: PaperlessInstanceWhereInput;
  };

  export type PaperlessInstanceUpdateToOneWithWhereWithoutSharedWithInput = {
    where?: PaperlessInstanceWhereInput;
    data: XOR<
      PaperlessInstanceUpdateWithoutSharedWithInput,
      PaperlessInstanceUncheckedUpdateWithoutSharedWithInput
    >;
  };

  export type PaperlessInstanceUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedPaperlessInstancesNestedInput;
    processedDocuments?: ProcessedDocumentUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    processedDocuments?: ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type UserCreateWithoutSharedAiProvidersInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutSharedAiProvidersInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutSharedAiProvidersInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutSharedAiProvidersInput,
      UserUncheckedCreateWithoutSharedAiProvidersInput
    >;
  };

  export type AiProviderCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiProvidersInput;
    bots?: AiBotCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderUncheckedCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    bots?: AiBotUncheckedCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderCreateOrConnectWithoutSharedWithInput = {
    where: AiProviderWhereUniqueInput;
    create: XOR<
      AiProviderCreateWithoutSharedWithInput,
      AiProviderUncheckedCreateWithoutSharedWithInput
    >;
  };

  export type UserUpsertWithoutSharedAiProvidersInput = {
    update: XOR<
      UserUpdateWithoutSharedAiProvidersInput,
      UserUncheckedUpdateWithoutSharedAiProvidersInput
    >;
    create: XOR<
      UserCreateWithoutSharedAiProvidersInput,
      UserUncheckedCreateWithoutSharedAiProvidersInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSharedAiProvidersInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutSharedAiProvidersInput,
      UserUncheckedUpdateWithoutSharedAiProvidersInput
    >;
  };

  export type UserUpdateWithoutSharedAiProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutSharedAiProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AiProviderUpsertWithoutSharedWithInput = {
    update: XOR<
      AiProviderUpdateWithoutSharedWithInput,
      AiProviderUncheckedUpdateWithoutSharedWithInput
    >;
    create: XOR<
      AiProviderCreateWithoutSharedWithInput,
      AiProviderUncheckedCreateWithoutSharedWithInput
    >;
    where?: AiProviderWhereInput;
  };

  export type AiProviderUpdateToOneWithWhereWithoutSharedWithInput = {
    where?: AiProviderWhereInput;
    data: XOR<
      AiProviderUpdateWithoutSharedWithInput,
      AiProviderUncheckedUpdateWithoutSharedWithInput
    >;
  };

  export type AiProviderUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiProvidersNestedInput;
    bots?: AiBotUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    bots?: AiBotUncheckedUpdateManyWithoutAiProviderNestedInput;
  };

  export type UserCreateWithoutSharedAiBotsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutSharedAiBotsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutSharedAiBotsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutSharedAiBotsInput, UserUncheckedCreateWithoutSharedAiBotsInput>;
  };

  export type AiBotCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiBotsInput;
    aiProvider: AiProviderCreateNestedOneWithoutBotsInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUncheckedCreateWithoutSharedWithInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    aiProviderId: string;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotCreateOrConnectWithoutSharedWithInput = {
    where: AiBotWhereUniqueInput;
    create: XOR<AiBotCreateWithoutSharedWithInput, AiBotUncheckedCreateWithoutSharedWithInput>;
  };

  export type UserUpsertWithoutSharedAiBotsInput = {
    update: XOR<UserUpdateWithoutSharedAiBotsInput, UserUncheckedUpdateWithoutSharedAiBotsInput>;
    create: XOR<UserCreateWithoutSharedAiBotsInput, UserUncheckedCreateWithoutSharedAiBotsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSharedAiBotsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutSharedAiBotsInput, UserUncheckedUpdateWithoutSharedAiBotsInput>;
  };

  export type UserUpdateWithoutSharedAiBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutSharedAiBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AiBotUpsertWithoutSharedWithInput = {
    update: XOR<AiBotUpdateWithoutSharedWithInput, AiBotUncheckedUpdateWithoutSharedWithInput>;
    create: XOR<AiBotCreateWithoutSharedWithInput, AiBotUncheckedCreateWithoutSharedWithInput>;
    where?: AiBotWhereInput;
  };

  export type AiBotUpdateToOneWithWhereWithoutSharedWithInput = {
    where?: AiBotWhereInput;
    data: XOR<AiBotUpdateWithoutSharedWithInput, AiBotUncheckedUpdateWithoutSharedWithInput>;
  };

  export type AiBotUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiBotsNestedInput;
    aiProvider?: AiProviderUpdateOneRequiredWithoutBotsNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutAiBotNestedInput;
  };

  export type UserCreateWithoutOwnedPaperlessInstancesInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutOwnedPaperlessInstancesInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutOwnedPaperlessInstancesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedCreateWithoutOwnedPaperlessInstancesInput
    >;
  };

  export type UserPaperlessInstanceAccessCreateWithoutInstanceInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedPaperlessInstancesInput;
  };

  export type UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserPaperlessInstanceAccessCreateOrConnectWithoutInstanceInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    create: XOR<
      UserPaperlessInstanceAccessCreateWithoutInstanceInput,
      UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
    >;
  };

  export type UserPaperlessInstanceAccessCreateManyInstanceInputEnvelope = {
    data:
      | UserPaperlessInstanceAccessCreateManyInstanceInput
      | UserPaperlessInstanceAccessCreateManyInstanceInput[];
    skipDuplicates?: boolean;
  };

  export type ProcessedDocumentCreateWithoutPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProcessedDocumentCreateOrConnectWithoutPaperlessInstanceInput = {
    where: ProcessedDocumentWhereUniqueInput;
    create: XOR<
      ProcessedDocumentCreateWithoutPaperlessInstanceInput,
      ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessedDocumentCreateManyPaperlessInstanceInputEnvelope = {
    data:
      | ProcessedDocumentCreateManyPaperlessInstanceInput
      | ProcessedDocumentCreateManyPaperlessInstanceInput[];
    skipDuplicates?: boolean;
  };

  export type ProcessingQueueCreateWithoutPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProcessingQueueCreateOrConnectWithoutPaperlessInstanceInput = {
    where: ProcessingQueueWhereUniqueInput;
    create: XOR<
      ProcessingQueueCreateWithoutPaperlessInstanceInput,
      ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessingQueueCreateManyPaperlessInstanceInputEnvelope = {
    data:
      | ProcessingQueueCreateManyPaperlessInstanceInput
      | ProcessingQueueCreateManyPaperlessInstanceInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutOwnedPaperlessInstancesInput = {
    update: XOR<
      UserUpdateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedUpdateWithoutOwnedPaperlessInstancesInput
    >;
    create: XOR<
      UserCreateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedCreateWithoutOwnedPaperlessInstancesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutOwnedPaperlessInstancesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutOwnedPaperlessInstancesInput,
      UserUncheckedUpdateWithoutOwnedPaperlessInstancesInput
    >;
  };

  export type UserUpdateWithoutOwnedPaperlessInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutOwnedPaperlessInstancesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserPaperlessInstanceAccessUpsertWithWhereUniqueWithoutInstanceInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    update: XOR<
      UserPaperlessInstanceAccessUpdateWithoutInstanceInput,
      UserPaperlessInstanceAccessUncheckedUpdateWithoutInstanceInput
    >;
    create: XOR<
      UserPaperlessInstanceAccessCreateWithoutInstanceInput,
      UserPaperlessInstanceAccessUncheckedCreateWithoutInstanceInput
    >;
  };

  export type UserPaperlessInstanceAccessUpdateWithWhereUniqueWithoutInstanceInput = {
    where: UserPaperlessInstanceAccessWhereUniqueInput;
    data: XOR<
      UserPaperlessInstanceAccessUpdateWithoutInstanceInput,
      UserPaperlessInstanceAccessUncheckedUpdateWithoutInstanceInput
    >;
  };

  export type UserPaperlessInstanceAccessUpdateManyWithWhereWithoutInstanceInput = {
    where: UserPaperlessInstanceAccessScalarWhereInput;
    data: XOR<
      UserPaperlessInstanceAccessUpdateManyMutationInput,
      UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceInput
    >;
  };

  export type ProcessedDocumentUpsertWithWhereUniqueWithoutPaperlessInstanceInput = {
    where: ProcessedDocumentWhereUniqueInput;
    update: XOR<
      ProcessedDocumentUpdateWithoutPaperlessInstanceInput,
      ProcessedDocumentUncheckedUpdateWithoutPaperlessInstanceInput
    >;
    create: XOR<
      ProcessedDocumentCreateWithoutPaperlessInstanceInput,
      ProcessedDocumentUncheckedCreateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessedDocumentUpdateWithWhereUniqueWithoutPaperlessInstanceInput = {
    where: ProcessedDocumentWhereUniqueInput;
    data: XOR<
      ProcessedDocumentUpdateWithoutPaperlessInstanceInput,
      ProcessedDocumentUncheckedUpdateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessedDocumentUpdateManyWithWhereWithoutPaperlessInstanceInput = {
    where: ProcessedDocumentScalarWhereInput;
    data: XOR<
      ProcessedDocumentUpdateManyMutationInput,
      ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessedDocumentScalarWhereInput = {
    AND?: ProcessedDocumentScalarWhereInput | ProcessedDocumentScalarWhereInput[];
    OR?: ProcessedDocumentScalarWhereInput[];
    NOT?: ProcessedDocumentScalarWhereInput | ProcessedDocumentScalarWhereInput[];
    id?: StringFilter<'ProcessedDocument'> | string;
    paperlessId?: IntFilter<'ProcessedDocument'> | number;
    title?: StringFilter<'ProcessedDocument'> | string;
    processedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    aiProvider?: StringFilter<'ProcessedDocument'> | string;
    tokensUsed?: IntFilter<'ProcessedDocument'> | number;
    changes?: JsonNullableFilter<'ProcessedDocument'>;
    originalTitle?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalCorrespondent?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalDocumentType?: StringNullableFilter<'ProcessedDocument'> | string | null;
    originalTags?: StringNullableListFilter<'ProcessedDocument'>;
    createdAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    updatedAt?: DateTimeFilter<'ProcessedDocument'> | Date | string;
    paperlessInstanceId?: StringFilter<'ProcessedDocument'> | string;
  };

  export type ProcessingQueueUpsertWithWhereUniqueWithoutPaperlessInstanceInput = {
    where: ProcessingQueueWhereUniqueInput;
    update: XOR<
      ProcessingQueueUpdateWithoutPaperlessInstanceInput,
      ProcessingQueueUncheckedUpdateWithoutPaperlessInstanceInput
    >;
    create: XOR<
      ProcessingQueueCreateWithoutPaperlessInstanceInput,
      ProcessingQueueUncheckedCreateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessingQueueUpdateWithWhereUniqueWithoutPaperlessInstanceInput = {
    where: ProcessingQueueWhereUniqueInput;
    data: XOR<
      ProcessingQueueUpdateWithoutPaperlessInstanceInput,
      ProcessingQueueUncheckedUpdateWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessingQueueUpdateManyWithWhereWithoutPaperlessInstanceInput = {
    where: ProcessingQueueScalarWhereInput;
    data: XOR<
      ProcessingQueueUpdateManyMutationInput,
      ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceInput
    >;
  };

  export type ProcessingQueueScalarWhereInput = {
    AND?: ProcessingQueueScalarWhereInput | ProcessingQueueScalarWhereInput[];
    OR?: ProcessingQueueScalarWhereInput[];
    NOT?: ProcessingQueueScalarWhereInput | ProcessingQueueScalarWhereInput[];
    id?: StringFilter<'ProcessingQueue'> | string;
    paperlessId?: IntFilter<'ProcessingQueue'> | number;
    status?: StringFilter<'ProcessingQueue'> | string;
    priority?: IntFilter<'ProcessingQueue'> | number;
    attempts?: IntFilter<'ProcessingQueue'> | number;
    lastError?: StringNullableFilter<'ProcessingQueue'> | string | null;
    scheduledFor?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    startedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
    completedAt?: DateTimeNullableFilter<'ProcessingQueue'> | Date | string | null;
    createdAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    updatedAt?: DateTimeFilter<'ProcessingQueue'> | Date | string;
    paperlessInstanceId?: StringFilter<'ProcessingQueue'> | string;
  };

  export type UserCreateWithoutOwnedAiProvidersInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutOwnedAiProvidersInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutOwnedAiProvidersInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutOwnedAiProvidersInput,
      UserUncheckedCreateWithoutOwnedAiProvidersInput
    >;
  };

  export type UserAiProviderAccessCreateWithoutAiProviderInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedAiProvidersInput;
  };

  export type UserAiProviderAccessUncheckedCreateWithoutAiProviderInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiProviderAccessCreateOrConnectWithoutAiProviderInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    create: XOR<
      UserAiProviderAccessCreateWithoutAiProviderInput,
      UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
    >;
  };

  export type UserAiProviderAccessCreateManyAiProviderInputEnvelope = {
    data:
      | UserAiProviderAccessCreateManyAiProviderInput
      | UserAiProviderAccessCreateManyAiProviderInput[];
    skipDuplicates?: boolean;
  };

  export type AiBotCreateWithoutAiProviderInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiBotsInput;
    sharedWith?: UserAiBotAccessCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUncheckedCreateWithoutAiProviderInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserAiBotAccessUncheckedCreateNestedManyWithoutAiBotInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotCreateOrConnectWithoutAiProviderInput = {
    where: AiBotWhereUniqueInput;
    create: XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>;
  };

  export type AiBotCreateManyAiProviderInputEnvelope = {
    data: AiBotCreateManyAiProviderInput | AiBotCreateManyAiProviderInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutOwnedAiProvidersInput = {
    update: XOR<
      UserUpdateWithoutOwnedAiProvidersInput,
      UserUncheckedUpdateWithoutOwnedAiProvidersInput
    >;
    create: XOR<
      UserCreateWithoutOwnedAiProvidersInput,
      UserUncheckedCreateWithoutOwnedAiProvidersInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutOwnedAiProvidersInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutOwnedAiProvidersInput,
      UserUncheckedUpdateWithoutOwnedAiProvidersInput
    >;
  };

  export type UserUpdateWithoutOwnedAiProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutOwnedAiProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserAiProviderAccessUpsertWithWhereUniqueWithoutAiProviderInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    update: XOR<
      UserAiProviderAccessUpdateWithoutAiProviderInput,
      UserAiProviderAccessUncheckedUpdateWithoutAiProviderInput
    >;
    create: XOR<
      UserAiProviderAccessCreateWithoutAiProviderInput,
      UserAiProviderAccessUncheckedCreateWithoutAiProviderInput
    >;
  };

  export type UserAiProviderAccessUpdateWithWhereUniqueWithoutAiProviderInput = {
    where: UserAiProviderAccessWhereUniqueInput;
    data: XOR<
      UserAiProviderAccessUpdateWithoutAiProviderInput,
      UserAiProviderAccessUncheckedUpdateWithoutAiProviderInput
    >;
  };

  export type UserAiProviderAccessUpdateManyWithWhereWithoutAiProviderInput = {
    where: UserAiProviderAccessScalarWhereInput;
    data: XOR<
      UserAiProviderAccessUpdateManyMutationInput,
      UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderInput
    >;
  };

  export type AiBotUpsertWithWhereUniqueWithoutAiProviderInput = {
    where: AiBotWhereUniqueInput;
    update: XOR<AiBotUpdateWithoutAiProviderInput, AiBotUncheckedUpdateWithoutAiProviderInput>;
    create: XOR<AiBotCreateWithoutAiProviderInput, AiBotUncheckedCreateWithoutAiProviderInput>;
  };

  export type AiBotUpdateWithWhereUniqueWithoutAiProviderInput = {
    where: AiBotWhereUniqueInput;
    data: XOR<AiBotUpdateWithoutAiProviderInput, AiBotUncheckedUpdateWithoutAiProviderInput>;
  };

  export type AiBotUpdateManyWithWhereWithoutAiProviderInput = {
    where: AiBotScalarWhereInput;
    data: XOR<AiBotUpdateManyMutationInput, AiBotUncheckedUpdateManyWithoutAiProviderInput>;
  };

  export type UserCreateWithoutOwnedAiBotsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutOwnedAiBotsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
    aiUsageMetrics?: AiUsageMetricUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutOwnedAiBotsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutOwnedAiBotsInput, UserUncheckedCreateWithoutOwnedAiBotsInput>;
  };

  export type AiProviderCreateWithoutBotsInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiProvidersInput;
    sharedWith?: UserAiProviderAccessCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderUncheckedCreateWithoutBotsInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserAiProviderAccessUncheckedCreateNestedManyWithoutAiProviderInput;
  };

  export type AiProviderCreateOrConnectWithoutBotsInput = {
    where: AiProviderWhereUniqueInput;
    create: XOR<AiProviderCreateWithoutBotsInput, AiProviderUncheckedCreateWithoutBotsInput>;
  };

  export type UserAiBotAccessCreateWithoutAiBotInput = {
    id?: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutSharedAiBotsInput;
  };

  export type UserAiBotAccessUncheckedCreateWithoutAiBotInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiBotAccessCreateOrConnectWithoutAiBotInput = {
    where: UserAiBotAccessWhereUniqueInput;
    create: XOR<
      UserAiBotAccessCreateWithoutAiBotInput,
      UserAiBotAccessUncheckedCreateWithoutAiBotInput
    >;
  };

  export type UserAiBotAccessCreateManyAiBotInputEnvelope = {
    data: UserAiBotAccessCreateManyAiBotInput | UserAiBotAccessCreateManyAiBotInput[];
    skipDuplicates?: boolean;
  };

  export type AiUsageMetricCreateWithoutAiBotInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    user: UserCreateNestedOneWithoutAiUsageMetricsInput;
  };

  export type AiUsageMetricUncheckedCreateWithoutAiBotInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    userId: string;
  };

  export type AiUsageMetricCreateOrConnectWithoutAiBotInput = {
    where: AiUsageMetricWhereUniqueInput;
    create: XOR<
      AiUsageMetricCreateWithoutAiBotInput,
      AiUsageMetricUncheckedCreateWithoutAiBotInput
    >;
  };

  export type AiUsageMetricCreateManyAiBotInputEnvelope = {
    data: AiUsageMetricCreateManyAiBotInput | AiUsageMetricCreateManyAiBotInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutOwnedAiBotsInput = {
    update: XOR<UserUpdateWithoutOwnedAiBotsInput, UserUncheckedUpdateWithoutOwnedAiBotsInput>;
    create: XOR<UserCreateWithoutOwnedAiBotsInput, UserUncheckedCreateWithoutOwnedAiBotsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutOwnedAiBotsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutOwnedAiBotsInput, UserUncheckedUpdateWithoutOwnedAiBotsInput>;
  };

  export type UserUpdateWithoutOwnedAiBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutOwnedAiBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AiProviderUpsertWithoutBotsInput = {
    update: XOR<AiProviderUpdateWithoutBotsInput, AiProviderUncheckedUpdateWithoutBotsInput>;
    create: XOR<AiProviderCreateWithoutBotsInput, AiProviderUncheckedCreateWithoutBotsInput>;
    where?: AiProviderWhereInput;
  };

  export type AiProviderUpdateToOneWithWhereWithoutBotsInput = {
    where?: AiProviderWhereInput;
    data: XOR<AiProviderUpdateWithoutBotsInput, AiProviderUncheckedUpdateWithoutBotsInput>;
  };

  export type AiProviderUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiProvidersNestedInput;
    sharedWith?: UserAiProviderAccessUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderUncheckedUpdateWithoutBotsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderNestedInput;
  };

  export type UserAiBotAccessUpsertWithWhereUniqueWithoutAiBotInput = {
    where: UserAiBotAccessWhereUniqueInput;
    update: XOR<
      UserAiBotAccessUpdateWithoutAiBotInput,
      UserAiBotAccessUncheckedUpdateWithoutAiBotInput
    >;
    create: XOR<
      UserAiBotAccessCreateWithoutAiBotInput,
      UserAiBotAccessUncheckedCreateWithoutAiBotInput
    >;
  };

  export type UserAiBotAccessUpdateWithWhereUniqueWithoutAiBotInput = {
    where: UserAiBotAccessWhereUniqueInput;
    data: XOR<
      UserAiBotAccessUpdateWithoutAiBotInput,
      UserAiBotAccessUncheckedUpdateWithoutAiBotInput
    >;
  };

  export type UserAiBotAccessUpdateManyWithWhereWithoutAiBotInput = {
    where: UserAiBotAccessScalarWhereInput;
    data: XOR<
      UserAiBotAccessUpdateManyMutationInput,
      UserAiBotAccessUncheckedUpdateManyWithoutAiBotInput
    >;
  };

  export type AiUsageMetricUpsertWithWhereUniqueWithoutAiBotInput = {
    where: AiUsageMetricWhereUniqueInput;
    update: XOR<
      AiUsageMetricUpdateWithoutAiBotInput,
      AiUsageMetricUncheckedUpdateWithoutAiBotInput
    >;
    create: XOR<
      AiUsageMetricCreateWithoutAiBotInput,
      AiUsageMetricUncheckedCreateWithoutAiBotInput
    >;
  };

  export type AiUsageMetricUpdateWithWhereUniqueWithoutAiBotInput = {
    where: AiUsageMetricWhereUniqueInput;
    data: XOR<AiUsageMetricUpdateWithoutAiBotInput, AiUsageMetricUncheckedUpdateWithoutAiBotInput>;
  };

  export type AiUsageMetricUpdateManyWithWhereWithoutAiBotInput = {
    where: AiUsageMetricScalarWhereInput;
    data: XOR<
      AiUsageMetricUpdateManyMutationInput,
      AiUsageMetricUncheckedUpdateManyWithoutAiBotInput
    >;
  };

  export type PaperlessInstanceCreateWithoutProcessedDocumentsInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedPaperlessInstancesInput;
    sharedWith?: UserPaperlessInstanceAccessCreateNestedManyWithoutInstanceInput;
    processingQueue?: ProcessingQueueCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUncheckedCreateWithoutProcessedDocumentsInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutInstanceInput;
    processingQueue?: ProcessingQueueUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceCreateOrConnectWithoutProcessedDocumentsInput = {
    where: PaperlessInstanceWhereUniqueInput;
    create: XOR<
      PaperlessInstanceCreateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedCreateWithoutProcessedDocumentsInput
    >;
  };

  export type PaperlessInstanceUpsertWithoutProcessedDocumentsInput = {
    update: XOR<
      PaperlessInstanceUpdateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedUpdateWithoutProcessedDocumentsInput
    >;
    create: XOR<
      PaperlessInstanceCreateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedCreateWithoutProcessedDocumentsInput
    >;
    where?: PaperlessInstanceWhereInput;
  };

  export type PaperlessInstanceUpdateToOneWithWhereWithoutProcessedDocumentsInput = {
    where?: PaperlessInstanceWhereInput;
    data: XOR<
      PaperlessInstanceUpdateWithoutProcessedDocumentsInput,
      PaperlessInstanceUncheckedUpdateWithoutProcessedDocumentsInput
    >;
  };

  export type PaperlessInstanceUpdateWithoutProcessedDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedPaperlessInstancesNestedInput;
    sharedWith?: UserPaperlessInstanceAccessUpdateManyWithoutInstanceNestedInput;
    processingQueue?: ProcessingQueueUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateWithoutProcessedDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceNestedInput;
    processingQueue?: ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceCreateWithoutProcessingQueueInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedPaperlessInstancesInput;
    sharedWith?: UserPaperlessInstanceAccessCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceUncheckedCreateWithoutProcessingQueueInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutInstanceInput;
    processedDocuments?: ProcessedDocumentUncheckedCreateNestedManyWithoutPaperlessInstanceInput;
  };

  export type PaperlessInstanceCreateOrConnectWithoutProcessingQueueInput = {
    where: PaperlessInstanceWhereUniqueInput;
    create: XOR<
      PaperlessInstanceCreateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedCreateWithoutProcessingQueueInput
    >;
  };

  export type PaperlessInstanceUpsertWithoutProcessingQueueInput = {
    update: XOR<
      PaperlessInstanceUpdateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedUpdateWithoutProcessingQueueInput
    >;
    create: XOR<
      PaperlessInstanceCreateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedCreateWithoutProcessingQueueInput
    >;
    where?: PaperlessInstanceWhereInput;
  };

  export type PaperlessInstanceUpdateToOneWithWhereWithoutProcessingQueueInput = {
    where?: PaperlessInstanceWhereInput;
    data: XOR<
      PaperlessInstanceUpdateWithoutProcessingQueueInput,
      PaperlessInstanceUncheckedUpdateWithoutProcessingQueueInput
    >;
  };

  export type PaperlessInstanceUpdateWithoutProcessingQueueInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedPaperlessInstancesNestedInput;
    sharedWith?: UserPaperlessInstanceAccessUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateWithoutProcessingQueueInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type UserCreateWithoutAiUsageMetricsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutAiUsageMetricsInput = {
    id?: string;
    username: string;
    passwordHash: string;
    role?: $Enums.UserRole;
    mustChangePassword?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiProviders?: AiProviderUncheckedCreateNestedManyWithoutOwnerInput;
    ownedAiBots?: AiBotUncheckedCreateNestedManyWithoutOwnerInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedCreateNestedManyWithoutUserInput;
    sharedAiBots?: UserAiBotAccessUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutAiUsageMetricsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAiUsageMetricsInput,
      UserUncheckedCreateWithoutAiUsageMetricsInput
    >;
  };

  export type AiBotCreateWithoutAiUsageMetricsInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    owner: UserCreateNestedOneWithoutOwnedAiBotsInput;
    aiProvider: AiProviderCreateNestedOneWithoutBotsInput;
    sharedWith?: UserAiBotAccessCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotUncheckedCreateWithoutAiUsageMetricsInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
    aiProviderId: string;
    sharedWith?: UserAiBotAccessUncheckedCreateNestedManyWithoutAiBotInput;
  };

  export type AiBotCreateOrConnectWithoutAiUsageMetricsInput = {
    where: AiBotWhereUniqueInput;
    create: XOR<
      AiBotCreateWithoutAiUsageMetricsInput,
      AiBotUncheckedCreateWithoutAiUsageMetricsInput
    >;
  };

  export type UserUpsertWithoutAiUsageMetricsInput = {
    update: XOR<
      UserUpdateWithoutAiUsageMetricsInput,
      UserUncheckedUpdateWithoutAiUsageMetricsInput
    >;
    create: XOR<
      UserCreateWithoutAiUsageMetricsInput,
      UserUncheckedCreateWithoutAiUsageMetricsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAiUsageMetricsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutAiUsageMetricsInput, UserUncheckedUpdateWithoutAiUsageMetricsInput>;
  };

  export type UserUpdateWithoutAiUsageMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutAiUsageMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    passwordHash?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownedPaperlessInstances?: PaperlessInstanceUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiProviders?: AiProviderUncheckedUpdateManyWithoutOwnerNestedInput;
    ownedAiBots?: AiBotUncheckedUpdateManyWithoutOwnerNestedInput;
    sharedPaperlessInstances?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiProviders?: UserAiProviderAccessUncheckedUpdateManyWithoutUserNestedInput;
    sharedAiBots?: UserAiBotAccessUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AiBotUpsertWithoutAiUsageMetricsInput = {
    update: XOR<
      AiBotUpdateWithoutAiUsageMetricsInput,
      AiBotUncheckedUpdateWithoutAiUsageMetricsInput
    >;
    create: XOR<
      AiBotCreateWithoutAiUsageMetricsInput,
      AiBotUncheckedCreateWithoutAiUsageMetricsInput
    >;
    where?: AiBotWhereInput;
  };

  export type AiBotUpdateToOneWithWhereWithoutAiUsageMetricsInput = {
    where?: AiBotWhereInput;
    data: XOR<
      AiBotUpdateWithoutAiUsageMetricsInput,
      AiBotUncheckedUpdateWithoutAiUsageMetricsInput
    >;
  };

  export type AiBotUpdateWithoutAiUsageMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiBotsNestedInput;
    aiProvider?: AiProviderUpdateOneRequiredWithoutBotsNestedInput;
    sharedWith?: UserAiBotAccessUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateWithoutAiUsageMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiBotAccessUncheckedUpdateManyWithoutAiBotNestedInput;
  };

  export type PaperlessInstanceCreateManyOwnerInput = {
    id?: string;
    name: string;
    apiUrl: string;
    apiToken: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AiProviderCreateManyOwnerInput = {
    id?: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AiBotCreateManyOwnerInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    aiProviderId: string;
  };

  export type UserPaperlessInstanceAccessCreateManyUserInput = {
    id?: string;
    instanceId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiProviderAccessCreateManyUserInput = {
    id?: string;
    aiProviderId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type UserAiBotAccessCreateManyUserInput = {
    id?: string;
    aiBotId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type AiUsageMetricCreateManyUserInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    aiBotId?: string | null;
  };

  export type PaperlessInstanceUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sharedWith?: UserPaperlessInstanceAccessUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sharedWith?: UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceNestedInput;
    processedDocuments?: ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
    processingQueue?: ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceNestedInput;
  };

  export type PaperlessInstanceUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    apiUrl?: StringFieldUpdateOperationsInput | string;
    apiToken?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiProviderUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sharedWith?: UserAiProviderAccessUpdateManyWithoutAiProviderNestedInput;
    bots?: AiBotUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    sharedWith?: UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderNestedInput;
    bots?: AiBotUncheckedUpdateManyWithoutAiProviderNestedInput;
  };

  export type AiProviderUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    apiKey?: StringFieldUpdateOperationsInput | string;
    baseUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiBotUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: AiProviderUpdateOneRequiredWithoutBotsNestedInput;
    sharedWith?: UserAiBotAccessUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiBotAccessUncheckedUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
  };

  export type UserPaperlessInstanceAccessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    instance?: PaperlessInstanceUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    instanceId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    instanceId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: AiProviderUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserAiProviderAccessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    aiProviderId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiBot?: AiBotUpdateOneRequiredWithoutSharedWithNestedInput;
  };

  export type UserAiBotAccessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    aiBotId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    aiBotId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiUsageMetricUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiBot?: AiBotUpdateOneWithoutAiUsageMetricsNestedInput;
  };

  export type AiUsageMetricUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiBotId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AiUsageMetricUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiBotId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type UserPaperlessInstanceAccessCreateManyInstanceInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type ProcessedDocumentCreateManyPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    title: string;
    processedAt?: Date | string;
    aiProvider: string;
    tokensUsed?: number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: string | null;
    originalCorrespondent?: string | null;
    originalDocumentType?: string | null;
    originalTags?: ProcessedDocumentCreateoriginalTagsInput | string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProcessingQueueCreateManyPaperlessInstanceInput = {
    id?: string;
    paperlessId: number;
    status?: string;
    priority?: number;
    attempts?: number;
    lastError?: string | null;
    scheduledFor?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type UserPaperlessInstanceAccessUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedPaperlessInstancesNestedInput;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserPaperlessInstanceAccessUncheckedUpdateManyWithoutInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessedDocumentUpdateWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessedDocumentUncheckedUpdateWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessedDocumentUncheckedUpdateManyWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    title?: StringFieldUpdateOperationsInput | string;
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    aiProvider?: StringFieldUpdateOperationsInput | string;
    tokensUsed?: IntFieldUpdateOperationsInput | number;
    changes?: NullableJsonNullValueInput | InputJsonValue;
    originalTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    originalCorrespondent?: NullableStringFieldUpdateOperationsInput | string | null;
    originalDocumentType?: NullableStringFieldUpdateOperationsInput | string | null;
    originalTags?: ProcessedDocumentUpdateoriginalTagsInput | string[];
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessingQueueUpdateWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessingQueueUncheckedUpdateWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProcessingQueueUncheckedUpdateManyWithoutPaperlessInstanceInput = {
    id?: StringFieldUpdateOperationsInput | string;
    paperlessId?: IntFieldUpdateOperationsInput | number;
    status?: StringFieldUpdateOperationsInput | string;
    priority?: IntFieldUpdateOperationsInput | number;
    attempts?: IntFieldUpdateOperationsInput | number;
    lastError?: NullableStringFieldUpdateOperationsInput | string | null;
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessCreateManyAiProviderInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type AiBotCreateManyAiProviderInput = {
    id?: string;
    name: string;
    systemPrompt: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    ownerId: string;
  };

  export type UserAiProviderAccessUpdateWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedAiProvidersNestedInput;
  };

  export type UserAiProviderAccessUncheckedUpdateWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiProviderAccessUncheckedUpdateManyWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiBotUpdateWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: UserUpdateOneRequiredWithoutOwnedAiBotsNestedInput;
    sharedWith?: UserAiBotAccessUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
    sharedWith?: UserAiBotAccessUncheckedUpdateManyWithoutAiBotNestedInput;
    aiUsageMetrics?: AiUsageMetricUncheckedUpdateManyWithoutAiBotNestedInput;
  };

  export type AiBotUncheckedUpdateManyWithoutAiProviderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    systemPrompt?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    ownerId?: StringFieldUpdateOperationsInput | string;
  };

  export type UserAiBotAccessCreateManyAiBotInput = {
    id?: string;
    userId: string;
    permission?: $Enums.Permission;
    createdAt?: Date | string;
  };

  export type AiUsageMetricCreateManyAiBotInput = {
    id?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number | null;
    documentId?: number | null;
    createdAt?: Date | string;
    userId: string;
  };

  export type UserAiBotAccessUpdateWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSharedAiBotsNestedInput;
  };

  export type UserAiBotAccessUncheckedUpdateWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserAiBotAccessUncheckedUpdateManyWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    permission?: EnumPermissionFieldUpdateOperationsInput | $Enums.Permission;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AiUsageMetricUpdateWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutAiUsageMetricsNestedInput;
  };

  export type AiUsageMetricUncheckedUpdateWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type AiUsageMetricUncheckedUpdateManyWithoutAiBotInput = {
    id?: StringFieldUpdateOperationsInput | string;
    provider?: StringFieldUpdateOperationsInput | string;
    model?: StringFieldUpdateOperationsInput | string;
    promptTokens?: IntFieldUpdateOperationsInput | number;
    completionTokens?: IntFieldUpdateOperationsInput | number;
    totalTokens?: IntFieldUpdateOperationsInput | number;
    estimatedCost?: NullableFloatFieldUpdateOperationsInput | number | null;
    documentId?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
