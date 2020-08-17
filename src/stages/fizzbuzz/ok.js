const fizzBuzz = (n) =>
  [...Array(n).keys()].map((i) => {
    if (i % 15 === 0) {
      return 'FizzBuzz'
    }
    if (i % 3 === 0) {
      return 'Fizz'
    }
    if (i % 5 === 0) {
      return 'Buzz'
    }
    return `${i}`
  })

console.log(fizzBuzz(15).join('\n'))
