import * as fs from 'fs';
import * as comb from "js-combinatorics";

interface Booking {
    id: number,
    start: string,
    end: string
}

interface Solution {
    bookingSet: Booking[],
    relocations: number,
}

let data: Booking[] =[];

try{
     data = JSON.parse(fs.readFileSync('data/bookings-simple.json', 'utf8'));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

const solution: Solution = brute(data);
console.log(`Min relocations: ${solution.relocations}`);
console.log(`Optimal bookings: ${JSON.stringify(solution.bookingSet)}`);
writeToFile(solution.bookingSet);

function brute(bookings: Booking[]): Solution{
    const permutations: Booking[][] = comb.permutation(bookings, 6);
    let optimalBookings: Booking[];
    let minRelocations = Number.MAX_SAFE_INTEGER;
    permutations.forEach((bookingSet) => {
        const relocations = calculateRelocations(bookingSet);
        if (relocations < minRelocations) {
            optimalBookings = bookingSet;
            minRelocations = relocations;
        }
    });
    return {bookingSet: optimalBookings, relocations: minRelocations};
}

function calculateRelocations(bookings: Booking[]){
    let relocations = 0;
    for (let i = 0; i < bookings.length - 1; i++) {
        if (bookings[i].end !== bookings[i+1].start){
            relocations += 1;
        } 
    }
    return relocations;
}

function writeToFile(bookings: Booking[]){
    fs.writeFileSync('results.json', JSON.stringify(bookings.map((booking) => booking.id)));
}

