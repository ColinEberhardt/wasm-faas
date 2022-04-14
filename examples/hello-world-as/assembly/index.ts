import "wasi";
import { Console, Environ } from "as-wasi";

Console.log("Hello World!");
Console.log("");

let env = new Environ();
let variables = env.all();
for (let i = 0; i < variables.length; i++) {
  let v = variables[i];
  Console.log(`${v.key}: ${v.value}`);
}
