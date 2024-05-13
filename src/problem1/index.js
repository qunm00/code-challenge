var sum_to_n_a = function (n) {
  if (n <= 0) return "Please enter positive integer!";

  // sum of an arithmetic of a series
  return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
  if (n <= 0) return "Please enter positive integer!";

  // for loop
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

function sum_to_n_c(n) {
  if (n <= 0) return "Please enter positive integer!";

  // while loop
  let sum = 0;
  while (n > 0) {
    sum += n;
    n -= 1;
  }
  return sum;
}

/**
 * REMARKS:
 * - both Array.reduce() and recursion don't scale at all
 * - with very big number, node returns unexpected result using for loop and while loop
 *   https://stackoverflow.com/questions/18046347/unexpected-results-when-working-with-very-big-integers-on-interpreted-languages
 */

function test() {
  let number_list = [];

  for (let number = 1; number <= 10; number++) {
    number_list.push(10 ** number);
  }
  number_list.push(Number.MAX_SAFE_INTEGER);

  for (const number of number_list) {
    console.log(`number = ${number}`);
    console.log(sum_to_n_a(number));
    console.log(sum_to_n_b(number));
    console.log(sum_to_n_c(number));
    console.log();
  }
}

test();
