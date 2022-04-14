import "wasi";
import { Console } from "as-wasi";
import { priceOption } from "./pricing";

Console.log("Hello World!");

const spot = 100.0;
const strike = 105.0;
const vol = 0.2;
const riskFree = 0.05;

const price = priceOption(strike, spot, 1, vol, riskFree);
Console.log(`${price}`);
