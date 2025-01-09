// This is an algorithm of taking a square root using Taylor series, giving a lot of control over how precise this number should be. 
// Most of modern calculators use this method with 15 iterations, which is a limit of digits after the dot, making it the most precise way.
// __precision is used to fix actuall round outputs. For example square root of 16 should be 4, but it will return 4.123105625617661,
// but with higher __precision values you can round up this value, but this algorithm is not made to find roots of common values.
// It's not entirely useless, but I don't know if it actually serves some practical use, cause it's really slow... or not?

function Factorial(n: number): number {
    if (n == 0) return 1;
    return n * Factorial(n - 1);
}

function ApproxSqrt(number: number) {
    var lo = 0, hi = number;
    while (lo <= hi) {
        var mid = Math.floor((lo + hi) / 2);
        if(mid * mid > number) hi = mid - 1;
        else lo = mid + 1;
    }
    return hi;
}

function TaylorSqrt(S: number, __i: number = 15, __precision: number = 0): void {
    let N = ApproxSqrt(S) // N - is the closest square root taken (rounded down)
    let d = 0, ep = Math.pow(10,-__precision)
    for (let n = 0; n < __i; n++) d += (Math.pow(-1,n)*Factorial(2*n)*Math.pow(ep, n))/((1-(2*n))*Math.pow(Factorial(n),2)*Math.pow(4,n)*Math.pow(N,2*n))
    let result = N*d;
    console.log(result)
}

const input = 10; // The number from which you need to take the square root.
TaylorSqrt(input, 15)

// Renarde Rose
