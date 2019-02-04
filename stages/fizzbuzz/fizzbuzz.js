// delete me
const fizzBuzz = n =>
  [...Array(n).keys()].map(i => {
    if (i % 3 == 0) {
      return 'Fizz'
    }
    if (i % 5 == 0) {
      return 'Yuzz'
    }
    if (i % 15 == 0) {
      return 'FizzYuzz'
    }
    return `${i}`
  })

// delete me

console.log(fizzBuzz(150).join('\n')) // delete me
