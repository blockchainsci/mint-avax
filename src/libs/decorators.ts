/**
 * 打印函数名、参数、函数执行的时间
 * @returns 
 */
export function printMethodInfo() {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any {
        let method = descriptor.value;
        if (typeof method === 'function') {
            descriptor.value = function (...args: any) {
                console.log(`[start ] ${target.constructor.name}.${propertyKey}`);
                console.log(`with args:`, args);
                let start = Date.now();
                let result = method.apply(this, [...args]);
                let end = Date.now();
                console.log(`[end ${target.constructor.name}.${propertyKey}] => ${end - start}ms`);
                return result;
            };
        }
    };
}

// type ServiceClass = {
//     serverId: string
//     new(...args: any[]): {}
// }

// export function registerService<T extends ServiceClass>(constructor: T) {

//     ServiceRegistry.registerService(constructor.serverId, constructor)
// }
