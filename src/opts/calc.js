export default function randYears() {
    let randYearA = Math.floor(Math.random() * 700)
    let randYearB = -1

    // if on the lower end is less than 50 choose anything in the higher end
    if (randYearA < 50) {
        randYearB = Math.floor(Math.random() * (700 - (randYearA + 50))) + randYearA + 50;
    }

    // if on the higher end is less than 50 choose anything in the lower end
    else if ((700 - (randYearA + 50)) < 50) {
        randYearB = Math.floor(Math.random() * (randYearA - 50))
    }
    else {
        const randYearBLower = Math.floor(Math.random() * (randYearA - 50))
        const randYearBHigher = Math.floor(Math.random() * (700 - (randYearA + 50))) + randYearA + 50;

        randYearB = (Math.random() >= 0.5) ? randYearBLower : randYearBHigher
    }

    return [randYearA + 1225, randYearB + 1225]
}