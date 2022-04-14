class Nullable<T> {
  constructor(public value: T, public isNull: bool = false) {}

  get notNull(): bool {
    return !this.isNull;
  }
}

const NullF64 = new Nullable<f64>(0, true);

class Val {
  current: f64;
  min: f64;
  max: f64;
}

enum OptionType {
  Call = 1,
  Put = -1,
}

function boxMullerRand(): f64 {
  while (true) {
    let x = Math.random() * 2.0 - 1;
    let y = Math.random() * 2.0 - 1;
    let d = x * x + y * y;
    if (d < 1) {
      return x * sqrt((-2 * Math.log(d)) / d);
    }
  }
}

function pathFinalMinMax(
  initial: f64,
  time: f64,
  steps: i32,
  volatility: f64,
  riskfree: f64
): Val {
  const dt = time / f64(steps);
  const sdt = sqrt(dt);
  const drift = Math.exp((riskfree - 0.5 * volatility * volatility) * dt);

  let current = initial;
  let min = current;
  let max = current;
  for (let i = 0; i < steps - 1; i++) {
    current = current * drift * Math.exp(sdt * volatility * boxMullerRand());
    if (min > current) min = current;
    if (max < current) max = current;
  }

  return { current: current, min: min, max: max };
}

export function priceOption(
  strike: f64,
  spot: f64,
  time: i32,
  volatility: f64,
  riskFree: f64,
  optionType: OptionType = OptionType.Call,
  knockin: Nullable<f64> = NullF64,
  knockout: Nullable<f64> = NullF64,
  simulations: i32 = 50000,
  stepsPerUnit: i32 = 365
): f64 {
  if (knockin.notNull && knockout.notNull)
    throw new Error("Unable to cope with 2 barriers!");

  let total = 0.0;
  for (let i = 0; i < simulations; i++) {
    const val = pathFinalMinMax(
      spot,
      time,
      time * stepsPerUnit,
      volatility,
      riskFree
    );
    if (knockin.notNull && knockin.value > spot && val.max < knockin.value) {
      //  Up and In
    } else if (
      knockin.notNull &&
      knockin.value < spot &&
      val.min > knockin.value
    ) {
      // Down and In
    } else if (
      knockout.notNull &&
      knockout.value < spot &&
      val.min < knockin.value
    ) {
      // Down and Out
    } else if (
      knockout.notNull &&
      knockout.value > spot &&
      val.max > knockout.value
    ) {
      // Up and Out
    } else {
      total += Math.max(0, optionType * (val.current - strike));
    }
  }

  return (total / simulations) * Math.exp(-time * riskFree);
}
